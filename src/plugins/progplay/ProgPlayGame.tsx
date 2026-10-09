import React,{ useState, useRef, useEffect, useCallback } from 'react';
import { BaseGameProps, GameExitPayload } from '../../types/gamePlugin';
import { EditorSettings, CursorPosition } from './types';
import {
GAME_LANGUAGES,
LEVELS_BY_LANGUAGE,
GameLanguageId,
GameLevel
} from './constants/levels';
import { THEMES } from './constants/themes';
import { EditorHeader } from './components/EditorHeader';
import { EditorTabs } from './components/EditorTabs';
import { Breadcrumbs } from './components/Breadcrumbs';
import { CodeEditor } from './components/CodeEditor';
import { EditorStatusBar } from './components/EditorStatusBar';
import { OutputPanel, LogEntry } from './components/OutputPanel';
import { DoorStage } from './components/DoorStage';
import { KeypressHUD } from './components/KeypressHUD';
import { LanguageSelectModal } from './components/LanguageSelectModal';
import { PlaygroundView } from './components/PlaygroundView';
import { CompetitionModal } from './components/CompetitionModal';
import { DuelUser } from './services/progplayDuelService';
import { sounds } from './utils/sound';

export interface ProgPlayGameProps extends BaseGameProps {
  studentName?: string;
  studentAvatar?: string;
}

export const ProgPlayGame: React.FC<ProgPlayGameProps> = ({
  studentClass = 'warrior',
  difficultyMultiplier = 1.0,
  onExitToHub,
  studentName = 'Aluno',
  studentAvatar = ''
}) => {
  // Session tracking para entrega de métricas ao Hub
  const sessionStartRef = useRef<number>(Date.now());
  const [sessionScore, setSessionScore] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [wrongAnswers, setWrongAnswers] = useState<number>(0);

  // Application Mode: 'challenges' (Porta/Simulador Fases 1 a 20) | 'playground' (Código Livre e Terminal Python)
  const [appMode, setAppMode] = useState<'challenges' | 'playground'>('challenges');

  // 1v1 Competition Battle Quiz Modal State
  const [isCompetitionModalOpen, setIsCompetitionModalOpen] = useState<boolean>(false);

  // Current authenticated student representation
  const currentUser: DuelUser = {
    uid: 'current-student',
    displayName: studentName,
    photoURL: studentAvatar
  };

  // Modal for picking language (5 cards: JavaScript, Python, CSS, HTML, SQL)
  // Aberto por padrão ao entrar no jogo para apresentar as opções e explicar o jogo
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(true);

  const [selectedLanguage, setSelectedLanguage] = useState<GameLanguageId>('javascript');

  // Track unlocked level per language (default: 1)
  const [unlockedLevels, setUnlockedLevels] = useState<Record<GameLanguageId, number>>({
    javascript: 1,
    python: 1,
    css: 1,
    html: 1,
    sql: 1,
  });

  // Active level index (0 to 19)
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  
  // Mobile & Tablet view: 'editor' | 'door'
  const [activeMobileView, setActiveMobileView] = useState<'editor' | 'door'>('editor');

  const languageLevels = LEVELS_BY_LANGUAGE[selectedLanguage] || LEVELS_BY_LANGUAGE.javascript;
  const currentLevel: GameLevel = languageLevels[currentLevelIndex] || languageLevels[0];
  const unlockedLevel = unlockedLevels[selectedLanguage] || 1;

  const [code, setCode] = useState<string>(currentLevel.initialCode);
  const [isDoorOpen, setIsDoorOpen] = useState<boolean>(false);
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [hasAttempted, setHasAttempted] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const [settings, setSettings] = useState<EditorSettings>({
    theme: 'vs-dark-modern',
    fontSize: 14,
    tabSize: 2,
    wordWrap: true,
    minimap: false,
    lineNumbers: true,
  });

  const [cursorPos, setCursorPos] = useState<CursorPosition>({ lineNumber: 1, column: 1 });
  const [outputOpen, setOutputOpen] = useState<boolean>(true);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      type: 'info',
      content: `ProgPlay carregado! Linguagem: ${selectedLanguage.toUpperCase()}. Resolva os desafios no editor para abrir o Enigma das Portas!`,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const editorRef = useRef<any>(null);
  const activeTheme = THEMES[settings.theme] || THEMES['vs-dark-modern'];

  // Current file name based on language
  const currentLangConfig = GAME_LANGUAGES.find((l) => l.id === selectedLanguage) || GAME_LANGUAGES[0];
  const fileName = `porta_fase_${currentLevel.id}${currentLangConfig.extension}`;
  const isModified = code !== currentLevel.initialCode;

  // Append log helper
  const addLog = useCallback((type: LogEntry['type'], content: string) => {
    setLogs((prev) => [
      ...prev,
      {
        type,
        content,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  }, []);

  // Sync code whenever current level changes
  useEffect(() => {
    setCode(currentLevel.initialCode);
    setIsDoorOpen(false);
    setValidationMessage('');
    setHasAttempted(false);
    addLog('info', `Fase ${currentLevel.id}: ${currentLevel.title}. ${currentLevel.targetObjective}`);
  }, [currentLevelIndex, selectedLanguage]);

  // Handler de saída oficial que alimenta a economia do Hub do TypeClicker
  const handleExitGame = useCallback(() => {
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - sessionStartRef.current) / 1000));
    const totalAnswers = correctAnswers + wrongAnswers;
    const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 100;
    
    // Sugestão de bytes ponderada pelo multiplicador de dificuldade
    const baseBytes = Math.round(sessionScore * 0.15 * difficultyMultiplier);

    const payload: GameExitPayload = {
      bytesEarned: baseBytes,
      levelTokensEarned: accuracy >= 80 && correctAnswers >= 2 ? 1 : 0,
      sessionStats: {
        score: sessionScore,
        accuracyPercentage: accuracy,
        timeSpentSeconds: elapsedSeconds,
        correctAnswers,
        wrongAnswers,
        levelReached: unlockedLevel,
        extraMetrics: {
          currentLanguage: selectedLanguage,
          studentClass,
        }
      }
    };

    onExitToHub(payload);
  }, [sessionScore, correctAnswers, wrongAnswers, difficultyMultiplier, unlockedLevel, selectedLanguage, studentClass, onExitToHub]);

  // Handle validating student code
  const executeCode = useCallback(async () => {
    if (isEvaluating) return;
    setIsEvaluating(true);
    setHasAttempted(true);
    addLog('info', `Executando validação da Fase ${currentLevel.id}...`);

    try {
      const evaluation = await currentLevel.validate(code);

      if (evaluation.success) {
        setIsDoorOpen(true);
        setValidationMessage(evaluation.message || 'Código perfeito! Porta destrancada com sucesso!');
        addLog('success', `[SUCESSO] ${evaluation.message || 'Porta destrancada com sucesso!'}`);
        sounds.playDoorOpen();

        // Incrementa progresso da sessão
        setSessionScore((prev) => prev + 150);
        setCorrectAnswers((prev) => prev + 1);

        // Desbloqueia próxima fase se aplicável
        if (currentLevel.id >= unlockedLevel) {
          const nextLevelNum = currentLevel.id + 1;
          setUnlockedLevels((prev) => ({
            ...prev,
            [selectedLanguage]: Math.max(prev[selectedLanguage], nextLevelNum),
          }));
        }
      } else {
        setIsDoorOpen(false);
        setValidationMessage(evaluation.message);
        addLog('error', `[ERRO] ${evaluation.message}`);
        sounds.playError();
        setWrongAnswers((prev) => prev + 1);
      }
    } catch (err: any) {
      setIsDoorOpen(false);
      const msg = err?.message || 'Erro inesperado na análise do código.';
      setValidationMessage(msg);
      addLog('error', `[EXCEÇÃO] ${msg}`);
      sounds.playError();
      setWrongAnswers((prev) => prev + 1);
    } finally {
      setIsEvaluating(false);
    }
  }, [code, currentLevel, isEvaluating, selectedLanguage, unlockedLevel, addLog]);

  // Reset current code to template
  const handleResetCode = useCallback(() => {
    setCode(currentLevel.initialCode);
    setIsDoorOpen(false);
    setValidationMessage('');
    addLog('info', 'Código redefinido para o esqueleto inicial.');
    sounds.playClick();
  }, [currentLevel, addLog]);

  // Advance to next challenge level
  const handleNextLevel = useCallback(() => {
    if (currentLevelIndex < languageLevels.length - 1) {
      setCurrentLevelIndex((prev) => prev + 1);
      sounds.playSuccess();
    } else {
      addLog('success', `🏆 PARABÉNS! Você concluiu todos os ${languageLevels.length} níveis de ${selectedLanguage.toUpperCase()}!`);
      sounds.playSuccess();
    }
  }, [currentLevelIndex, languageLevels.length, selectedLanguage, addLog]);

  // Select level directly from Door Stage grid
  const handleSelectLevel = useCallback((lvlNum: number) => {
    const idx = languageLevels.findIndex((l) => l.id === lvlNum);
    if (idx !== -1) {
      setCurrentLevelIndex(idx);
      sounds.playClick();
    }
  }, [languageLevels]);

  // Select language from Modal
  const handleSelectLanguage = useCallback((langId: GameLanguageId) => {
    setSelectedLanguage(langId);
    setCurrentLevelIndex(0);
    setIsLanguageModalOpen(false);
    sounds.playSuccess();
  }, []);

  return (
    <div 
      className="flex flex-col h-screen w-screen overflow-hidden select-none font-sans"
      style={{ backgroundColor: activeTheme.ui.bg, color: activeTheme.ui.tabText }}
    >
      {/* HUD de Teclas no Canto Inferior */}
      <KeypressHUD />

      {/* MODAL: SELETOR DE LINGUAGEM */}
      <LanguageSelectModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={handleSelectLanguage}
        progressByLanguage={unlockedLevels}
      />

      {/* MODAL: ARENA DE DUELO 1x1 (Bytezinho Solo ou Sala P2P) */}
      <CompetitionModal
        isOpen={isCompetitionModalOpen}
        onClose={() => setIsCompetitionModalOpen(false)}
        currentUser={currentUser}
      />

      {/* VS CODE HEADER BAR */}
      <EditorHeader
        fileName={fileName}
        codeContent={code}
        settings={settings}
        onUpdateSettings={(newSettings) => setSettings((s) => ({ ...s, ...newSettings }))}
        onRunCode={executeCode}
        onFormatCode={() => addLog('info', 'Formatação automática aplicada.')}
        onResetCode={handleResetCode}
        isEvaluating={isEvaluating}
        currentLanguage={selectedLanguage}
        onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
        activeMobileView={activeMobileView}
        onSelectMobileView={setActiveMobileView}
        isDoorOpen={isDoorOpen}
        levelNumber={currentLevel.id}
        currentUser={currentUser}
        onExitToHub={handleExitGame}
        appMode={appMode}
        onToggleAppMode={(mode) => setAppMode(mode)}
        onOpenCompetitionModal={() => setIsCompetitionModalOpen(true)}
      />

      {/* RENDER PLAYGROUND OU ENIGMA DAS PORTAS */}
      {appMode === 'playground' ? (
        <div className="flex-1 overflow-hidden">
          <PlaygroundView
            settings={settings}
            onUpdateSettings={(newSettings) => setSettings((s) => ({ ...s, ...newSettings }))}
            onReturnToChallenges={() => setAppMode('challenges')}
            customCourse={null}
          />
        </div>
      ) : (
        /* Main Responsive Split Layout: Left (Editor) & Right (Door Stage) */
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          
          {/* LEFT PANE: VS CODE CODE EDITOR */}
          <div 
            className={`flex-1 flex-col h-full overflow-hidden border-b lg:border-b-0 lg:border-r border-[#2b2b2b] ${
              activeMobileView === 'editor' ? 'flex' : 'hidden lg:flex'
            }`}
          >
            {/* File Tab Bar */}
            <EditorTabs
              fileName={fileName}
              isModified={isModified}
              settings={settings}
              onResetCode={handleResetCode}
            />

            {/* Breadcrumbs */}
            <Breadcrumbs
              fileName={fileName}
              settings={settings}
              cursorLine={cursorPos.lineNumber}
            />

            {/* Monaco Editor Container */}
            <div className="flex-1 relative overflow-hidden">
              <CodeEditor
                code={code}
                language={currentLangConfig.monacoLang}
                settings={settings}
                onChange={(newVal) => setCode(newVal)}
                onCursorChange={(pos) => setCursorPos(pos)}
                onRunCode={executeCode}
                editorRef={editorRef}
              />
            </div>

            {/* Bottom Execution Terminal Drawer */}
            <OutputPanel
              logs={logs}
              isOpen={outputOpen}
              onClose={() => setOutputOpen(false)}
              onClearLogs={() => setLogs([])}
              settings={settings}
              isDoorOpen={isDoorOpen}
              currentCode={code}
              isPythonCourse={selectedLanguage === 'python'}
            />

            {/* VS Code Status Bar */}
            <EditorStatusBar
              fileName={fileName}
              language={currentLangConfig.name}
              cursorPos={cursorPos}
              settings={settings}
              outputOpen={outputOpen}
              onToggleOutput={() => setOutputOpen(!outputOpen)}
              errorCount={logs.filter((l) => l.type === 'error').length}
            />
          </div>

          {/* RIGHT PANE: THE INTERACTIVE DOOR GAME STAGE */}
          <div 
            className={`w-full lg:w-[48%] xl:w-[45%] h-full shrink-0 flex-col ${
              activeMobileView === 'door' ? 'flex' : 'hidden lg:flex'
            }`}
          >
            <DoorStage
              currentLevel={currentLevel}
              totalLevels={languageLevels.length}
              isDoorOpen={isDoorOpen}
              validationMessage={validationMessage}
              hasAttempted={hasAttempted}
              onNextLevel={handleNextLevel}
              onResetCode={handleResetCode}
              onSelectLevel={handleSelectLevel}
              unlockedLevel={unlockedLevel}
              onSwitchToEditor={() => setActiveMobileView('editor')}
            />
          </div>

        </div>
      )}
    </div>
  );
};

export default ProgPlayGame;

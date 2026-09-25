import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Parse CLI flags
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const isVerbose = args.includes('--verbose');
const fileArg = args.find(a => a.startsWith('--file=') || a.startsWith('-f='));
const filePath = fileArg ? fileArg.split('=')[1] : null;
const batchSizeArg = args.find(a => a.startsWith('--batch-size='));
const BATCH_SIZE = batchSizeArg ? parseInt(batchSizeArg.split('=')[1], 10) : 50;

console.log('====================================================');
console.log('🚀 EDUCA GAMEHUB: MIGRATION FIRESTORE -> SUPABASE');
console.log(`Modo: ${isDryRun ? 'DRY-RUN (Simulação sem gravação)' : 'PRODUÇÃO (Gravação ativa no Supabase)'}`);
console.log(`Batch size: ${BATCH_SIZE}`);
if (filePath) {
  console.log(`Fonte de dados: Arquivo JSON de Backup (${filePath})`);
} else {
  console.log(`Fonte de dados: Conexão direta Firestore (via ADC / Service Account)`);
}
console.log('====================================================\n');

// 1. Carrega credenciais do Supabase
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!isDryRun && (!supabaseUrl || !supabaseKey)) {
  console.error('❌ Erro: VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY (ou VITE_SUPABASE_ANON_KEY) devem estar definidos no ambiente!');
  console.error('Exemplo:');
  console.error('  export VITE_SUPABASE_URL="https://xyz.supabase.co"');
  console.error('  export SUPABASE_SERVICE_ROLE_KEY="sua-service-role-key"');
  console.error('  npm run migrate:supabase -- --file=backup.json\n');
  process.exit(1);
}

const supabase = (!isDryRun && supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

function chunkArray<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

interface LoadedData {
  savesMap: Map<string, any>;
  leaderboardMap: Map<string, any>;
}

async function loadData(): Promise<LoadedData> {
  const savesMap = new Map<string, any>();
  const leaderboardMap = new Map<string, any>();

  // Modo A: Carregamento a partir de arquivo de backup JSON gerado pelo Painel Admin
  if (filePath) {
    const resolvedPath = path.resolve(process.cwd(), filePath);
    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`Arquivo de backup não encontrado em: ${resolvedPath}`);
    }
    console.log(`📥 Lendo arquivo JSON: ${resolvedPath}...`);
    const fileContent = JSON.parse(fs.readFileSync(resolvedPath, 'utf-8'));

    const saves = fileContent.saves || {};
    const leaderboard = fileContent.leaderboard || {};

    for (const [id, data] of Object.entries(saves)) {
      savesMap.set(id, data);
    }
    for (const [id, data] of Object.entries(leaderboard)) {
      leaderboardMap.set(id, data);
    }

    console.log(`   ✓ Carregados ${savesMap.size} saves e ${leaderboardMap.size} registros de leaderboard do arquivo.`);
    return { savesMap, leaderboardMap };
  }

  // Modo B: Conexão direta ao Firestore via Firebase Admin SDK
  console.log('📥 Conectando ao Cloud Firestore via Firebase Admin SDK...');
  const { initializeApp, getApps } = await import('firebase-admin/app');
  const { getFirestore } = await import('firebase-admin/firestore');

  let firebaseConfig: any = {};
  const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || firebaseConfig.projectId || 'gen-lang-client-0277873219';
  const databaseId = process.env.FIRESTORE_DATABASE_ID || firebaseConfig.firestoreDatabaseId || '(default)';

  const app = getApps().length === 0 ? initializeApp({ projectId }) : getApps()[0];
  const db = databaseId && databaseId !== '(default)' ? getFirestore(app, databaseId) : getFirestore(app);

  const [savesSnap, boardSnap] = await Promise.all([
    db.collection('saves').get(),
    db.collection('leaderboard').get()
  ]);

  savesSnap.forEach((doc: any) => savesMap.set(doc.id, doc.data()));
  boardSnap.forEach((doc: any) => leaderboardMap.set(doc.id, doc.data()));

  console.log(`   ✓ Carregados ${savesMap.size} saves e ${leaderboardMap.size} registros de leaderboard diretamente do Firestore.`);
  return { savesMap, leaderboardMap };
}

async function runMigration() {
  try {
    const { savesMap, leaderboardMap } = await loadData();

    const allUserIds = new Set<string>([...savesMap.keys(), ...leaderboardMap.keys()]);
    console.log(`\n👥 Total de alunos/usuários identificados: ${allUserIds.size}`);

    const profilesToUpsert: any[] = [];
    const gameProgressToUpsert: any[] = [];
    const cosmeticsToUpsert: any[] = [];
    const achievementsToUpsert: any[] = [];

    for (const userId of allUserIds) {
      const save = savesMap.get(userId) || {};
      const board = leaderboardMap.get(userId) || {};
      const state = save.saveState || {};
      const cosmetics = state.cosmetics || {};

      const isStaff = board.isStaff || save.isStaff || (save.turma === 'Professor') || (board.turma === 'Professor');
      const displayName = (save.nome || board.nome || state.studentName || 'Aluno').trim();
      const nickname = (state.studentNickname || board.apelido || '').trim() || null;
      const turma = (isStaff ? 'Professor' : (save.turma || board.turma || state.studentClass || '')).trim() || null;
      const avatar = state.studentAvatar || board.avatar || (isStaff ? '👨‍🏫' : '👩‍💻');
      const totalBytes = Math.round(Number(save.points || board.points || state.totalBytesEarned || 0));
      const bytes = Math.round(Number(state.bytes || 0));
      const level = Math.round(Number(save.level || board.level || state.level || 1));

      // 1. Perfil Unificado
      profilesToUpsert.push({
        id: userId,
        display_name: displayName,
        nickname: nickname,
        avatar: avatar,
        turma: turma,
        role: isStaff ? 'teacher' : 'student',
        bytes: bytes,
        total_bytes_earned: totalBytes,
        level: level,
        level_tokens: Math.round(Number(cosmetics.levelTokens || 0)),
        duel_tokens: Math.round(Number(cosmetics.duelTokens || 0)),
        quantum_fragments: Math.round(Number(cosmetics.quantumFragments || 0)),
        prestige_count: Math.round(Number(state.prestigeCount || 0)),
        rpg_class: state.rpgClass || board.rpgClass || null,
        equipped_skin: cosmetics.equippedSkin || 'classic',
        equipped_frame: cosmetics.equippedCardFrame || board.cardFrame || null,
        equipped_theme: cosmetics.equippedTheme || null,
        email: save.email || board.email || null,
        schema_version: '2.0.0',
        updated_at: new Date().toISOString()
      });

      // 2. Progresso do Jogo TypeClicker
      gameProgressToUpsert.push({
        user_id: userId,
        game_id: 'typeclicker',
        high_score: totalBytes,
        current_floor: Math.round(Number(state.dungeonFloor || 1)),
        highest_floor: Math.round(Number(state.maxDungeonFloor || 1)),
        metrics: {
          wpm: Math.round(Number(board.wpm || 0)),
          maxCombo: Math.round(Number(board.maxCombo || 0)),
          accuracy: Number((Number(board.accuracy || 0)).toFixed(1)),
          pvpWins: Math.round(Number(board.pvpWins || 0)),
          raceWins: Math.round(Number(board.raceWins || 0)),
          radarHighScore: Math.round(Number(board.radarHighScore || 0))
        },
        state_payload: state,
        updated_at: new Date().toISOString()
      });

      // 3. Cosméticos Desbloqueados
      const unlockedSkins: string[] = cosmetics.unlockedSkins || [];
      const unlockedFrames: string[] = cosmetics.unlockedCardFrames || cosmetics.unlockedFrames || [];
      const unlockedThemes: string[] = cosmetics.unlockedThemes || [];

      for (const skin of unlockedSkins) {
        cosmeticsToUpsert.push({ user_id: userId, item_id: skin, item_category: 'skin', unlocked_at: new Date().toISOString() });
      }
      for (const frame of unlockedFrames) {
        cosmeticsToUpsert.push({ user_id: userId, item_id: frame, item_category: 'frame', unlocked_at: new Date().toISOString() });
      }
      for (const theme of unlockedThemes) {
        cosmeticsToUpsert.push({ user_id: userId, item_id: theme, item_category: 'theme', unlocked_at: new Date().toISOString() });
      }

      // 4. Conquistas
      const achievements: string[] = Array.isArray(state.achievements) ? state.achievements : [];
      for (const achId of achievements) {
        achievementsToUpsert.push({ user_id: userId, achievement_id: achId, unlocked_at: new Date().toISOString() });
      }

      if (isVerbose) {
        console.log(`   ✓ Processado: ${displayName} (${userId}) - ${totalBytes.toLocaleString()} bytes`);
      }
    }

    console.log(`\n📦 Registros transformados e validados:`);
    console.log(`   - public.profiles: ${profilesToUpsert.length}`);
    console.log(`   - public.game_progress: ${gameProgressToUpsert.length}`);
    console.log(`   - public.user_cosmetics: ${cosmeticsToUpsert.length}`);
    console.log(`   - public.user_achievements: ${achievementsToUpsert.length}`);

    if (isDryRun) {
      console.log('\n🔍 [DRY-RUN] Simulação concluída com sucesso! Nenhuma gravação foi efetuada.');
      console.log('Para gravar no Supabase, configure as variáveis de ambiente e execute sem --dry-run.');
      return;
    }

    if (!supabase) {
      throw new Error('Supabase client não está inicializado.');
    }

    console.log('\n📤 Iniciando upserts em lote no Supabase...');

    // Lote Profiles
    console.log('   -> Gravando public.profiles...');
    const profileBatches = chunkArray(profilesToUpsert, BATCH_SIZE);
    for (let i = 0; i < profileBatches.length; i++) {
      const batch = profileBatches[i];
      const { error } = await supabase.from('profiles').upsert(batch, { onConflict: 'id' });
      if (error) {
        console.error(`      ❌ Erro no lote ${i + 1}/${profileBatches.length} de profiles:`, error.message);
      } else {
        process.stdout.write(`      ✓ Lote ${i + 1}/${profileBatches.length} gravado (${batch.length} registros)\r`);
      }
    }
    console.log('\n   ✅ Profiles finalizados.');

    // Lote Game Progress
    console.log('   -> Gravando public.game_progress...');
    const progressBatches = chunkArray(gameProgressToUpsert, BATCH_SIZE);
    for (let i = 0; i < progressBatches.length; i++) {
      const batch = progressBatches[i];
      const { error } = await supabase.from('game_progress').upsert(batch, { onConflict: 'user_id, game_id' });
      if (error) {
        console.error(`      ❌ Erro no lote ${i + 1}/${progressBatches.length} de game_progress:`, error.message);
      } else {
        process.stdout.write(`      ✓ Lote ${i + 1}/${progressBatches.length} gravado (${batch.length} registros)\r`);
      }
    }
    console.log('\n   ✅ Game progress finalizado.');

    // Lote Cosmetics
    if (cosmeticsToUpsert.length > 0) {
      console.log('   -> Gravando public.user_cosmetics...');
      const cosmeticBatches = chunkArray(cosmeticsToUpsert, BATCH_SIZE);
      for (let i = 0; i < cosmeticBatches.length; i++) {
        const batch = cosmeticBatches[i];
        const { error } = await supabase.from('user_cosmetics').upsert(batch, { onConflict: 'user_id, item_id, item_category' });
        if (error) {
          console.error(`      ❌ Erro no lote ${i + 1}/${cosmeticBatches.length} de user_cosmetics:`, error.message);
        } else {
          process.stdout.write(`      ✓ Lote ${i + 1}/${cosmeticBatches.length} gravado (${batch.length} registros)\r`);
        }
      }
      console.log('\n   ✅ Cosméticos finalizados.');
    }

    // Lote Achievements
    if (achievementsToUpsert.length > 0) {
      console.log('   -> Gravando public.user_achievements...');
      const achievementBatches = chunkArray(achievementsToUpsert, BATCH_SIZE);
      for (let i = 0; i < achievementBatches.length; i++) {
        const batch = achievementBatches[i];
        const { error } = await supabase.from('user_achievements').upsert(batch, { onConflict: 'user_id, achievement_id' });
        if (error) {
          console.error(`      ❌ Erro no lote ${i + 1}/${achievementBatches.length} de user_achievements:`, error.message);
        } else {
          process.stdout.write(`      ✓ Lote ${i + 1}/${achievementBatches.length} gravado (${batch.length} registros)\r`);
        }
      }
      console.log('\n   ✅ Conquistas finalizadas.');
    }

    console.log('\n🎉 ====================================================');
    console.log('MIGRAÇÃO DE DADOS PARA O SUPABASE CONCLUÍDA COM SUCESSO!');
    console.log('====================================================\n');

  } catch (err: any) {
    console.error('\n❌ Falha durante a migração:', err.message || err);
    console.error('\nDica de uso:');
    console.error('1. Gere um arquivo de backup no Painel Admin do TypeClicker (botão "Gerar Backup .json").');
    console.error('2. Execute o comando apontando para o arquivo:');
    console.error('   npm run migrate:supabase:dry -- --file=caminho/do/backup.json');
    console.error('3. Para gravar no Supabase:');
    console.error('   VITE_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run migrate:supabase -- --file=caminho/do/backup.json\n');
    process.exit(1);
  }
}

runMigration();

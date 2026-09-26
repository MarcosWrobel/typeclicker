import { CategoryId, CurricularTrackId } from '../types';

export type TrackCodeSnippets = Record<CategoryId, string[]>;

export const CODE_SNIPPETS_BY_TRACK: Record<CurricularTrackId, TrackCodeSnippets> = {
  geral: {
    iniciante: [
      'let pontos = 0;',
      'const nome = "TypeClicker";',
      'color: #38bdf8;',
      'font-size: 16px;',
      'display: flex;',
      'console.log("Iniciando...");',
      'const ativo = true;',
      'total = preco * 2;',
      'border-radius: 8px;',
      'width: 100%; height: auto;',
      '<p className="texto">Olá Mundo</p>',
      '<button onClick={handleClick}>',
      'let vidas = 3;',
      'cursor: pointer;',
      'margin: 0px 8px;'
    ],
    facil: [
      'if (pontos >= 10) { vencer(); }',
      'const frutas = ["maçã", "banana"];',
      'button:hover { opacity: 0.9; }',
      'const dobro = (x) => x * 2;',
      'document.querySelector(".card");',
      'margin: 0 auto; padding: 1rem;',
      'const soma = a + b;',
      'while (vida > 0) { jogar(); }',
      '<div id="app" style={{ gap: 8 }}>',
      'border: 1px solid #334155;',
      'if (!usuario) { return null; }',
      'const items = [1, 2, 3, 4, 5];',
      'background-color: #0f172a;',
      'input.focus({ preventScroll: true });',
      'const delay = (ms) => setTimeout(fn, ms);'
    ],
    medio: [
      'const ativos = usuarios.filter(u => u.online);',
      'if (vidas > 0 && tempo <= 60) { return true; }',
      'const mensagem = `Nível atual: ${nivel}`;',
      'localStorage.setItem("recorde", pontos.toString());',
      'grid-template-columns: repeat(3, 1fr);',
      'const [valor, setValor] = useState(0);',
      'const user = { id: 1, name: "Lucas", rank: 5 };',
      'Math.floor(Math.random() * 100) + 1;',
      'items.forEach(item => console.log(item.titulo));',
      'background: linear-gradient(to right, #4f46e5, #06b6d4);',
      'if (combo > 50 || precisao >= 98) { subirNivel(); }',
      'const elemento = document.getElementById("canvas");',
      'flex-direction: column; justify-content: center;',
      'array.includes("javascript") ? "encontrado" : "ausente";',
      'const token = sessionStorage.getItem("auth_token");'
    ],
    avancado: [
      'const res = await fetch("/api/turmas"); const data = await res.json();',
      'const total = itens.reduce((acc, curr) => acc + curr.preco, 0);',
      'window.addEventListener("keydown", (e) => handleKey(e.key));',
      'const { id, nome, pontuacao = 0 } = aluno;',
      'try { processarDados(lista); } catch (err) { alert(err.message); }',
      'const ordenado = [...dados].sort((a, b) => b.score - a.score);',
      'export default function Componente({ title, count = 0 }) {',
      'box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);',
      'const [loading, setLoading] = useState<boolean>(false);',
      'export const somarValores = (x: number, y: number): number => x + y;'
    ],
    expert: [
      'interface AlunoProps { id: string; wpm: number; status: "ativo" | "inativo"; }',
      'const memoized = useMemo(() => items.filter(i => i.val > 50), [items]);',
      'async function salvarProgresso(uid: string): Promise<boolean> { return true; }',
      'const payload = JSON.parse(localStorage.getItem("config") || "{}");',
      'export const debounce = <T extends (...args: any[]) => void>(fn: T, ms: number) => {',
      'const formatado = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });'
    ]
  },

  scratch: {
    iniciante: [
      'mova (10) passos;',
      'gire para a direita (15) graus;',
      'toque o som [mia v];',
      'aponte para a direção (90);',
      'mude para a fantasia [fantasia2 v];',
      'mostre o ator no palco;',
      'esconda o ator do palco;',
      'defina o tamanho como (100)%;',
      'vá para x: (0) y: (0);',
      'espere (1) segundos;',
      'mude o efeito [cor v] por (25);',
      'limpe todos os efeitos gráficos;',
      'toque a nota (60) por (0.5) tempos;'
    ],
    facil: [
      'quando a bandeira verde for clicada',
      'quando a tecla [espaço v] for pressionada',
      'quando este ator for clicado',
      'se <tocando em [borda v]?> então { volte(); }',
      'sempre { mova (5) passos; se_na_borda_volte(); }',
      'repita (10) vezes { gire (36) graus; }',
      'defina [pontos v] para (0);',
      'adicione (1) a [pontos v];',
      'transmita [iniciar_jogo v];',
      'quando eu receber [iniciar_jogo v]',
      'crie clone de [este ator v];',
      'quando eu começar como um clone',
      'pergunte [Qual o seu nome?] e espere;',
      'diga (resposta) por (2) segundos;'
    ],
    medio: [
      'se <(pontos) > (10)> então { transmita [fase2 v]; }',
      'se <tocando na cor [#ff0000]?> então { mude [vidas v] por (-1); }',
      'repita até que <(distância_até [mouse-pointer v]) < (10)>',
      'deslize por (1) segs até x: (sorteie_entre (-200) e (200)) y: (100);',
      'defina o efeito [fantasma v] para (50);',
      'adicione (resposta) a [lista_de_recordes v];',
      'defina [velocidade_y v] para ((velocidade_y) - (1));',
      'se <não <tocando em [chão v]?>> então { caia(); }',
      'apague todos os itens de [placar_turma v];',
      'transmita [alerta v] e espere;'
    ],
    avancado: [
      'definir [pular] com [forca_pulo]: { defina [vel_y] para (forca_pulo); }',
      'definir [detectar_colisao]: { se <tocando em [obstaculo v]?> pare [todos]; }',
      'se <<tecla [seta direita v] pressionada?> e <(x) < (230)>> então',
      'defina [posicao_alvo] para (item (1) de [coordenadas_x v]);',
      'quando eu começar como clone { mostre; deslize (2) segs; apague este clone; }',
      'definir [desenhar_poligono] com [lados] [tamanho]: { repita (lados) { mova (tamanho); } }'
    ],
    expert: [
      'definir motor_fisica(gravidade, atrito): { vel_x = vel_x * atrito; y = y + vel_y; }',
      'quando receber [broadcast_sync]: { execute_sem_atualizar_tela { render_grid(); } }',
      'se <(item [1] de [inventario]) = [chave_mestra]> então { abrir_portal_secreto(); }',
      'definir raycast_2d(angulo, alcance): { x_sensor = x + sen(angulo) * alcance; }'
    ]
  },

  web: {
    iniciante: [
      '<h1 className="titulo">Educação Digital</h1>',
      '<div className="container mx-auto">',
      '<input type="text" placeholder="Digite..." />',
      '<button type="submit">Enviar</button>',
      '<a href="https://typeclicker.app">Link</a>',
      '<img src="/logo.svg" alt="TypeClicker" />',
      'display: flex; justify-content: center;',
      'align-items: center; gap: 16px;',
      'background-color: #0f172a; color: #f8fafc;',
      'border-radius: 12px; padding: 24px;',
      'const titulo = document.querySelector("h1");',
      'btn.addEventListener("click", () => alert("Oi!"));',
      'console.log("DOM Carregado!");'
    ],
    facil: [
      '<section id="hero" className="flex flex-col gap-4">',
      'grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));',
      'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);',
      'transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);',
      '@media (max-width: 768px) { flex-direction: column; }',
      'const [email, setEmail] = useState("");',
      'document.getElementById("btn-salvar").disabled = true;',
      'localStorage.setItem("tema_preferido", "escuro");',
      'const cards = Array.from(document.querySelectorAll(".card"));',
      'element.classList.toggle("ativo");'
    ],
    medio: [
      'const response = await fetch("https://api.github.com/users");',
      'const dados = await response.json(); renderizarCards(dados);',
      'const novosItens = itens.filter(item => item.concluido === false);',
      'const mapaNomes = turmas.map(turma => turma.nome.toUpperCase());',
      'form.addEventListener("submit", (e) => { e.preventDefault(); });',
      'window.scrollTo({ top: 0, behavior: "smooth" });',
      'const ctx = canvas.getContext("2d"); ctx.fillRect(10, 10, 50, 50);',
      'const observer = new IntersectionObserver((entries) => { ... });'
    ],
    avancado: [
      'async function carregarPlacar() { const res = await api.get("/ranking"); return res.data; }',
      'const debounce = (callback, delay) => { let timer; return (...args) => { ... }; };',
      'export const useWindowWidth = () => { const [w, setW] = useState(window.innerWidth); ... };',
      'const sanitized = inputString.replace(/<[^>]*>?/gm, "").trim();',
      'const unsubscribe = onSnapshot(docRef, (doc) => { setProgresso(doc.data()); });'
    ],
    expert: [
      'const memoizedCallback = useCallback((payload: EventData) => { dispatch(payload); }, [deps]);',
      'const controller = new AbortController(); fetch(url, { signal: controller.signal });',
      'class CustomElement extends HTMLElement { connectedCallback() { this.render(); } }',
      'const serviceWorker = await navigator.serviceWorker.register("/sw.js", { scope: "/" });'
    ]
  },

  empresarial: {
    iniciante: [
      '=SOMA(A1:A10)',
      '=MÉDIA(B2:B20)',
      '=MÁXIMO(C1:C50)',
      '=MÍNIMO(D1:D50)',
      '=CONT.VALORES(A:A)',
      '=HOJE()',
      '=AGORA()',
      '=ARRED(E2; 2)',
      '=MAIÚSCULA(F2)',
      '=MINÚSCULA(G2)',
      '=CONCATENAR(A2; " "; B2)',
      '=ESQUERDA(A1; 5)',
      '=DIREITA(B1; 3)'
    ],
    facil: [
      '=SE(B2>=7; "Aprovado"; "Recuperação")',
      '=SE(D2>0; "Saldo Positivo"; "Alerta de Débito")',
      '=CONT.SE(C2:C100; "Concluído")',
      '=SOMASE(A2:A50; "Vendas"; B2:B50)',
      '=MÉDIASE(D2:D100; ">0")',
      '=PROCV(E2; A2:C50; 3; FALSO)',
      '=PROCH("Total"; A1:Z10; 5; FALSO)',
      '=SUBTOTAL(9; C2:C100)',
      '=DIATRABALHOTOTAL(A2; B2)',
      '=TEXTO(A2; "DD/MM/AAAA")',
      '=NÚM.CARACT(C2)'
    ],
    medio: [
      '=SE(E(A2>=18; B2="Sim"); "Apto"; "Não Qualificado")',
      '=SE(OU(C2="Diretoria"; D2>10000); "Autorizado"; "Pendente")',
      '=ÍNDICE(TabelaPrecos[Valor]; CORRESP(D2; TabelaPrecos[Produto]; 0))',
      '=SOMASES(Vendas[Valor]; Vendas[Vendedor]; "Lucas"; Vendas[Mes]; 3)',
      '=SEERRO(PROCV(A2; Clientes!A:E; 5; FALSO); "Não Localizado")',
      '=CONT.SES(A:A; "8º Ano"; B:B; "Aprovado")',
      '=HIPERLINK("https://portal.empresa.com"; "Acessar Relatório Executivo")'
    ],
    avancado: [
      '=PROCX(A2; Clientes[ID]; Clientes[Nome]; "Não Encontrado"; 0)',
      '=FILTRO(Funcionarios[Nome]; (Funcionarios[Setor]="TI") * (Funcionarios[Salario]>5000))',
      '=CLASSIFICAR(ÚNICO(Vendas[Região]); 1; 1)',
      '=LET(subtotal; SOMA(B2:B20); imposto; subtotal * 0.15; subtotal + imposto)',
      'Sub GerarRelatorioConsolidado() Range("A1").Value = "Relatório Trimestral" End Sub',
      'Worksheets("Financeiro").Columns("A:G").AutoFit()'
    ],
    expert: [
      '=LAMBDA(base; taxa; base * (1 + taxa))',
      '=MAP(A2:A50; LAMBDA(v; SE(v>1000; "Premium"; "Standard")))',
      'Function ConciliarExtrato(planilha As Worksheet) As Double Application.ScreenUpdating = False End Function',
      'Set rs = conn.Execute("SELECT Aluno, Turma, WPM FROM Desempenho WHERE Nota >= 80")'
    ]
  },

  ingles: {
    iniciante: [
      'console.log("Hello, World!");',
      'const playerName = "Alex";',
      'let score = 100;',
      'return true;',
      'function startGame() {',
      'if (lives <= 0) { gameOver(); }',
      'for (let i = 0; i < 5; i++) {',
      'display: block; margin: 0 auto;',
      'font-weight: bold;',
      'text-align: center;'
    ],
    facil: [
      'const user = { name: "Sarah", role: "admin" };',
      'if (user.role === "admin") { grantAccess(); }',
      'const colors = ["red", "green", "blue"];',
      'button.addEventListener("click", handleClick);',
      'const isValid = input.value.trim().length > 0;',
      'window.localStorage.setItem("sound", "enabled");',
      'document.getElementById("main-title").innerText = "Welcome";',
      'setTimeout(() => { alert("Time is up!"); }, 3000);'
    ],
    medio: [
      'const activeUsers = users.filter(user => user.isOnline);',
      'const userNames = students.map(student => student.fullName);',
      'async function fetchLeaderboard() { const res = await fetch("/api"); }',
      'const totalScore = scores.reduce((sum, current) => sum + current, 0);',
      'export const calculateAccuracy = (hits, total) => (hits / total) * 100;',
      'try { await saveData(state); } catch (error) { console.error(error); }'
    ],
    avancado: [
      'export interface StudentProfile { id: string; wpm: number; rank: string; }',
      'const [searchQuery, setSearchQuery] = useState<string>("");',
      'window.addEventListener("resize", debounce(handleWindowResize, 200));',
      'const response = await fetch("/auth/token", { method: "POST", headers });',
      'export const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);'
    ],
    expert: [
      'export type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };',
      'const memoizedValue = useMemo(() => computeHeavyAnalytics(data), [data]);',
      'export function mergeConfigs<T extends Record<string, any>>(defaults: T, overrides: Partial<T>): T',
      'const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });'
    ]
  }
};

/**
 * Compatibilidade legada com referências diretas a CODE_SNIPPETS_BY_LEVEL.
 */
export const CODE_SNIPPETS_BY_LEVEL: Record<CategoryId, string[]> = CODE_SNIPPETS_BY_TRACK.geral;

/**
 * Retorna um snippet de código contextualizado para a trilha curricular e nível solicitados.
 */
export function getRandomCodeSnippet(
  categoryId?: CategoryId | string | null,
  excludeSnippet?: string,
  trackId?: CurricularTrackId | string | null
): string {
  const safeTrack: CurricularTrackId = (trackId && trackId in CODE_SNIPPETS_BY_TRACK)
    ? (trackId as CurricularTrackId)
    : 'geral';

  const safeCat: CategoryId = (categoryId && ['iniciante', 'facil', 'medio', 'avancado', 'expert'].includes(categoryId))
    ? (categoryId as CategoryId)
    : 'facil';

  const trackSnippets = CODE_SNIPPETS_BY_TRACK[safeTrack] || CODE_SNIPPETS_BY_TRACK.geral;
  const list = trackSnippets[safeCat] || trackSnippets.facil || CODE_SNIPPETS_BY_TRACK.geral.facil;

  const filtered = list.filter(s => s !== excludeSnippet);
  if (filtered.length === 0) return list[0] || 'const code = true;';
  return filtered[Math.floor(Math.random() * filtered.length)];
}

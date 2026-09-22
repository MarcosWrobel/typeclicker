import { CategoryId } from '../types';

export const CODE_SNIPPETS_BY_LEVEL: Record<CategoryId, string[]> = {
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
};

export function getRandomCodeSnippet(
  categoryId?: CategoryId | string | null,
  excludeSnippet?: string
): string {
  const safeCat = (categoryId && ['iniciante', 'facil', 'medio', 'avancado', 'expert'].includes(categoryId))
    ? (categoryId as CategoryId)
    : 'facil';

  const list = CODE_SNIPPETS_BY_LEVEL[safeCat] || CODE_SNIPPETS_BY_LEVEL.facil;
  const filtered = list.filter(s => s !== excludeSnippet);
  if (filtered.length === 0) return list[0] || 'const code = true;';
  return filtered[Math.floor(Math.random() * filtered.length)];
}

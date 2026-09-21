# ⌨️ TypeClicker Educa — Colégio Leopoldina

> **Plataforma educacional gamificada de digitação pedagógica, velocidade motora e RPG cibernético, desenvolvida sob medida para o laboratório de informática do Colégio Estadual Leopoldina Bittencourt Pedroso sob orientação do Professor Marcos Wrobel.**

[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%26%20Auth-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

---

## 📖 Visão Geral do Projeto

O **TypeClicker Educa** transforma o aprendizado e o aperfeiçoamento da digitação no padrão brasileiro **ABNT2** em uma experiência instigante e imersiva. Unindo as mecânicas aditivas de jogos *incrementais* (*idle / clicker games*) à profundidade narrativa de um **RPG cibernético em masmorras procedurais**, o projeto integra treino motor sério, vocabulário curricular e progressão constante.

Diferente de softwares de digitação tradicionais, no **TypeClicker** cada palavra digitada rende **Bytes virtuais**, **Fichas de Duelo** e **Fragmentos Quânticos**. Com esses recursos, os estudantes adquirem melhorias de hardware e software, desarmam vírus de rede, enfrentam chefes com mecânicas de controle de grupo em arenas literárias, desbloqueiam cosméticos exclusivos e competem em rankings escolares em tempo real.

---

## 🎮 Mecânicas Centrais de Jogabilidade

### 1. Moeda do Jogo: Bytes
- **Geração Ativa (Digitação Direta):** Cada palavra digitada sem erros converte caracteres em Bytes imediatos, impulsionados por multiplicadores de precisão e combos.
- **Geração Passiva (Hardware & Software):** Bytes podem ser reinvestidos na Loja para adquirir melhorias como *Memória RAM ECC*, *Script Bash no Laboratório*, *SSD NVMe* ou *Supercomputador Quântico*, gerando Bytes por segundo (B/s).

### 2. Bateria de Foco (Anti-Ociosidade Pedagógica)
- Para evitar que o aluno deixe o jogo rodando sozinho enquanto navega em outras abas, o sistema inclui a **Bateria de Foco**.
- A bateria é recarregada a cada tecla digitada. Se o aluno parar de digitar por mais de 5 segundos, o circuito "desconecta" e cessa a geração passiva de Bytes.
- **Modo Inclusivo / Cadência Adaptativa:** Professores podem ajustar a tolerância da bateria (5s, 10s, 15s ou sem limite de tempo) para atender alunos com necessidades especiais ou em fase inicial de alfabetização.

### 3. Combos e Sobrecarga de Circuito
- **Multiplicador de Combo:** Acertos consecutivos elevam o multiplicador até **5.0x**.
- **Mecânica de Sobrecarga (Overload):** Erros sucessivos causam superaquecimento do circuito, reduzindo o rendimento pela metade até que o estudante recupere a compostura e acerte 3 palavras seguidas.

---

## 🏰 Crônicas da Masmorra RPG (Batalhas de Chefes & Expedições)

Uma das maiores expansões da plataforma é o módulo **Crônicas da Masmorra**, um ambiente de batalha épico contra guardiões cibernéticos utilizando textos literários e científicos completos em língua portuguesa.

### 1. Sistema de Andares & Chefes Procedurais
- **Andares Crescentes com Escala Matemática:** Vida, armadura e frequência de feitiços dos guardiões escalam com curvas balanceadas (`floorData.boss`).
- **Textos Literários Contínuos:** Em vez de palavras isoladas, os estudantes digitam parágrafos densos e contextualizados (250 a 450 caracteres), exigindo pontuação, maiúsculas e fluência com o teclado ABNT2.
- **Armadura e Fraquezas Biomecânicas (`weaknessKeys`):** Os guardiões possuem resistência a dano comum, mas teclas específicas causam dano crítico massivo e ignoram 100% da armadura do chefe.
- **Minigame QTE — Sobrecarga do Núcleo:** Eventos dinâmicos em que uma sequência rápida de teclas deve ser golpeada para atordoar o guardião e abrir brechas de dano crítico.

### 2. Efeitos de Controle de Grupo (Debuffs de RPG)
Para simular a intensidade de combate dos RPGs e exigir domínio de teclado sob pressão, os chefes conjuram feitiços de interferência:
- **👁️ Cegueira Glifada (Blind):** Os caracteres à frente do cursor são ocultados e embaçados por névoa digital. Para dissipar o debuff, o aluno precisa confiar estritamente na **memória muscular e motora**, acertando 4 caracteres consecutivos às cegas.
- **❄️ Paralisia de Buffer (Hold / Freeze):** O cursor de digitação é completamente congelado e o escudo é atacado. O estudante precisa golpear rapidamente a **barra de [ESPAÇO] 3 vezes** para estilhaçar o gelo e retomar o controle.
- **🌀 Terror Psíquico (Fear):** O terminal entra em sobrecarga com pulsações visuais roxas e áudio dissonante. A digitação exige atenção redobrada para estabilizar o sistema.

### 3. Avisos em Duas Etapas (Spotlight Central $\rightarrow$ HUD Acoplada)
- **Fase 1 (Spotlight Central):** Assim que o feitiço é conjurado, um card neon com backdrop blur surge no **centro exato da tela**, exibindo um ícone gigante animado, o nome do debuff e a instrução clara em destaque: `👉 COMO QUEBRAR: [Ação necessária com contador dinâmico em tempo real]`. O foco do input é 100% preservado via `pointer-events-none`.
- **Fase 2 (Transição & Ancoragem):** Após 2 segundos, o card central sobe suavemente com física de mola e se acopla à barra de status fixada logo acima do texto de digitação.

### 4. Temporizadores Decrescentes & Penalidades Severas
- Cada debuff possui um **timer decrescente de 8 segundos** com barra de progresso colorida (verde $\rightarrow$ amarela $\rightarrow$ vermelha pulsante).
- **Tempo Esgotado:** Se o debuff não for quebrado a tempo, o aluno sofre **-25 de dano direto** ao escudo.
- **Dano Amplificado por Erro (2x):** Erros cometidos enquanto o jogador estiver sob debuff causam o dobro de penalidade ao escudo.

### 5. Sistema de Chaves de Expedição (`🔑`)
- A entrada na masmorra e a reinicialização de andares após derrota consomem **Chaves de Expedição** (limite de 5 chaves).
- Se as chaves zerarem, o botão de tentar novamente é bloqueado, orientando o aluno a retornar ao terminal principal para digitar palavras ou concluir Treinos Adaptativos e forjar novas chaves.

### 6. Árvore de Perks de 10 Níveis & Economia de EXP Calibrada
- **Expansão para 10 Níveis por Perk:** Cada um dos 4 perks possui 10 níveis de maestria (40 upgrades no total), eliminando a progressão curta anterior e garantindo longevidade ao RPG.
- **Bônus Suaves e Granulares:**
  - *Foco Crítico:* $+5\%$ dano em combo/nível (máx $+50\%$).
  - *Regeneração em Fraquezas:* $\lfloor 1 + \text{nv} \times 0.6 \rfloor$ de escudo/tecla de fraqueza (máx $+6$).
  - *Síntese de Bytes:* $+4\%$ bytes/nível (máx $+40\%$).
  - *Endurecimento de Escudo:* $-3.5\%$ desgaste por erro/nível (máx $-35\%$).
- **Travas por Andar (*Floor Gates* até o Andar 25+):** Requisitos rígidos de profundidade (`Nv. 1: Andar 1+`, `Nv. 2: Andar 2+`, `Nv. 3: Andar 4+`, `Nv. 4: Andar 6+`, `Nv. 5: Andar 8+`, `Nv. 6: Andar 10+`, `Nv. 7: Andar 13+`, `Nv. 8: Andar 16+`, `Nv. 9: Andar 20+`, `Nv. 10: Andar 25+`).
- **Custos Escalonados:** Progridem de 60 a 1.850 XP por nível (total de 6.560 XP por perk e 26.240 XP para a árvore completa), exigindo avanço consistente na Masmorra Procedural Infinita para maximização.

### 7. Algoritmo de Desafio do Boss & Tensão em Combate
- **Barra de Carga de Ataque Iminente (Boss Cast Bar):** O chefe canaliza ataques devastadores continuamente em um cronômetro regressivo. Se o aluno hesitar ou parar de digitar, o golpe atinge o escudo diretamente!
- **Interrupção e Atordoamento por Digitação:** Cada tecla correta atrasa o golpe (-2.5%), teclas de fraqueza causam **Atordoamento Crítico (-25% de carga)** e palavras limpas atrasam em -30%.
- **Modo de Fúria (< 30% HP):** O chefe entra em sobrecarga crítica com aura avermelhada, velocidade de ataque acelerada em +40% e dano de erro ampliado.
- **Dano de Erro Escalonado:** Misses tornam-se progressivamente mais perigosos em andares avançados ($7 + \text{andar} \times 1.4$), dobrando sob debuffs e triplicando na fúria.

---

## 🎯 Missões, Quests & Treinos Adaptativos

- **Quests Diárias & Semanais:** Metas dinâmicas como atingir determinada precisão média, manter sequências de combo ou derrotar chefes de andares específicos.
- **Motor de Identificação de Erros & Treino Adaptativo:** Monitoramento contínuo das teclas em que o aluno apresenta hesitação ou erro frequente. O sistema gera automaticamente sessões de calibração biomecânica personalizadas com as teclas fracas detectadas.
- **Sistema de Conquistas de Alta Dificuldade:** Desafios avançados voltados a alunos que buscam maestria motora, premiando com **Fragmentos Quânticos** raros e títulos honoríficos.

---

## 🚀 Desempenho de Alto Nível (Chromebooks & Cotas de Banco de Dados)

O TypeClicker foi rigorosamente auditado para garantir fluidez máxima em computadores escolares modestos (Chromebooks e desktops antigos) e operação com **custo zero** no Firebase Spark:

### 1. Otimizações de Cliente (Low-End Hardware)
- **Eliminação de Layout Thrashing de Scroll:** O alinhamento do cursor de digitação utiliza `behavior: 'auto', block: 'nearest'`, prevenindo acúmulo de animações de scroll da engine na GPU integrada durante digitação em alta velocidade (>100 PPM).
- **Eliminação de Re-renderizações Cíclicas na Raiz:** Salvamento periódico em `localStorage` otimizado para operação estritamente silenciosa (a cada 5s) e indexada pelo UID do aluno, sem estados intermediários forçando reconciliações na árvore React.
- **Isolamento da Batalha RPG:** Toda a execução de batalha, cálculo de dano, escudos e debuffs opera **100% no cliente sem chamadas de rede por caractere**.

### 2. Otimizações no Banco de Dados (Firebase Firestore Spark)
- **Throttling Inteligente (`useGameSync`):** Ciclo periódico de 60 segundos com disparos imediatos apenas em marcos decisivos (subida de nível, prestige, logout). Consumo de ~13.500 escritas diárias para 300 alunos, com folga de ~32% do teto gratuito (20.000 writes/dia).
- **Cache de Leitura do Ranking Escolar:** Implementado cache em memória de **40 segundos** em `getGlobalLeaderboard()`, evitando leituras repetidas na nuvem quando alunos abrem e fecham a tabela de classificação na mesma aula.

---

## 🏆 Exclusão Estrita de Professores e Admins dos Rankings

Para assegurar a integridade pedagógica e motivar os estudantes na disputa pelo pódio:
1. **Camada de Gravação (`saveProgressToCloud`):** Contas de professores (cadastradas em `system/settings.allowedTeachers`) e administradores (`ADMIN_EMAILS`) **nunca gravam dados na coleção `/leaderboard`**. Se houver registro legado, o sistema executa a exclusão automática via `deleteDoc`. O progresso pessoal é mantido em segurança no `/saves/{userId}`.
2. **Camada de Consulta e Visualização:** Tanto o `LeaderboardModal` quanto o painel administrativo filtram registros com `isStaff: true`, e-mails do corpo docente e turmas com identificação de professor/coordenação.
3. **Ferramenta de Higienização de Rankings:** Botão **`[ 🧹 Higienizar Rankings ]`** integrado ao Painel do Professor (`AdminPanel.tsx`), permitindo purgar do Firestore registros legados de qualquer conta da equipe escolar com um clique.

---

## 🌟 Funcionalidades e Recursos Detalhados

### 🏆 1. Trilha de Progressão: 100 Níveis Balanceados
Uma esteira de aprendizado equilibrada com progressão matemática para acompanhar o ano letivo completo:
- **10 Tiers Educacionais:**
  1. **Níveis 1 a 10 — Fundamentos:** Postura, linha central (`ASDF JKLÇ`) e ritmo básico.
  2. **Níveis 11 a 20 — Laboratório:** Primeiros comandos, navegação de diretórios e atalhos.
  3. **Níveis 21 a 30 — Ritmo & Foco:** Palavras médias com acentuação e pontuação.
  4. **Níveis 31 a 40 — Algoritmos & Lógica:** Termos de ciências da computação e raciocínio lógico.
  5. **Níveis 41 a 50 — Desenvolvedor Mirim:** Estruturas de dados, sintaxes e palavras longas.
  6. **Níveis 51 a 60 — Especialista:** Velocidade contínua (>60 PPM) e alta cadência.
  7. **Níveis 61 a 70 — Engenharia de Software:** Precisão cirúrgica em termos técnicos complexos.
  8. **Níveis 71 a 80 — Arquiteto de Sistemas:** Fluência absoluta de teclado.
  9. **Níveis 81 a 90 — Mestre Hacker:** Desafios de reflexo rápido e vocabulário avançado.
  10. **Níveis 91 a 100 — Lenda do Leopoldina:** Conquista máxima reservada aos digitadores de elite do colégio.
- **Painel de Conquistas:** Modal visual detalhando os 100 níveis, requisitos, títulos honoríficos e recompensas.

### 📚 2. Dificuldade Dinâmica e Anti-Regressão
- Mais de **400 termos pedagógicos** distribuídos em 5 graus de desafio (*Iniciante*, *Fácil*, *Médio*, *Avançado* e *Expert*).
- **Anti-Regressão Pedagógica:** Ao atingir determinados marcos de nível, as categorias excessivamente fáceis são trancadas automaticamente, garantindo que o estudante continue evoluindo seu repertório e coordenação motora.
- **Suporte Nativo a Teclado ABNT2:** Tratamento de teclas mortas (*dead keys* como `~`, `´`, `^`, `` ` ``) e cedilha (`ç`), prevenindo travamentos ou falhas de digitação em navegadores de laboratório.

### 🔄 3. Overclock (Sistema de Prestige)
- Desbloqueado a partir do Nível 25.
- Permite ao estudante "reiniciar" seu hardware e saldo de Bytes em troca de **Núcleos Quânticos de Processamento**.
- Cada núcleo confere um bônus permanente de **+20% na eficiência de geração**, introduzindo noções de planejamento estratégico e reinvestimento.

### 🛡️ 4. Desafios de Firewall (Mini-game de Segurança)
- Em marcos decimais (Níveis 10, 20, 30...), um alarme sonoro e visual anuncia uma invasão no terminal.
- O aluno precisa transcrever uma chave criptográfica sob pressão do cronômetro para restabelecer o firewall e receber bônus expressivos de Bytes.
- **Acessibilidade:** Opção para reduzir alertas visuais estroboscópicos para alunos fotossensíveis.

### ⚔️ 5. Arena Multijogador (Typing Battle em Tempo Real)
- Modo competitivo local onde alunos do laboratório criam salas ou entram via código de 4 letras.
- Capacidade de até 16 competidores por sala com visualização em tempo real do avanço dos colegas na pista.
- Contagem regressiva de largada, palavras idênticas para todos os competidores e tela de pódio final com estatísticas de PPM e acurácia.

### 🏁 6. Sistema de Corridas em Sala de Aula (Classroom Race Sincronizada)
- **Disparo Coletivo pelo Professor:** O professor lança um desafio de digitação em tempo real através da nova aba **Corrida** no Painel Administrativo.
- **Interrupção e Foco Imediato no Terminal:** A corrida interrompe o terminal dos estudantes com uma tela focada e contagem regressiva sincronizada em segundos (`startsAtMs`), colocando todos os alunos da turma para digitar o exato mesmo texto simultaneamente.
- **Textos Curriculares e Literários:** Biblioteca integrada com trechos sobre *Lovelace e Turing*, *Dom Casmurro*, *Inteligência Artificial*, *O Guarani*, *A Revolução dos Chips* e editor para textos customizados da aula.
- **Resolução Atômica e Premiação do Vencedor:** O primeiro aluno a completar 100% do texto é consagrado vencedor via transação atômica no Firestore (`runTransaction`), recebendo um prêmio massivo de Bytes, confetes animados e **+1 vitória de corrida** (`raceWins`).
- **Ranking Geral de Corridas:** Tabela de classificação própria e exclusiva no `LeaderboardModal` (aba `[ 🏁 Corridas ]`), ranqueando os alunos por número de vitórias, melhor PPM e participações, com filtros de série/turma e pódio com medalhas.

### 🎨 7. Temas & Efeitos Especiais de Terminal
- Loja de cosméticos com mais de 12 temas retrô e modernos:
  - *Matrix Code Rain*, *Cyberpunk Neon*, *Terminal Amber CRT*, *Laboratório Stealth CLI*, *Midnight Blue*, *Synthwave 80s*, *Solarized Dark*, *Paper Clean*, entre outros.
- Efeitos visuais dinâmicos como linhas de varredura CRT, fósforo verde e animações de partícula.

### 🤖 8. Mascote Pedagógico "Bytezinho"
- Personagem interativo que reage às ações do aluno.
- Fornece dicas de postura física, posicionamento dos 10 dedos no teclado, lembretes de salvar o jogo e incentivos de superação.

### 🏆 9. Rankings Escolares Multimétricas (Custo Zero no Firebase Spark)
O `LeaderboardModal` foi expandido para ranquear os alunos em **6 categorias competitivas e pedagógicas independentes**:
1. 🏆 **Nível & XP:** Progressão geral da conta e marcos alcançados.
2. ⚡ **Velocidade (PPM):** Agilidade bruta em Palavras Por Minuto e precisão de digitação.
3. 🔥 **Maior Combo:** Maior sequência ininterrupta de teclas corretas sem nenhum erro.
4. 💾 **Total de Bytes:** Volume histórico vitalício de bytes acumulados ao longo da carreira.
5. ⚔️ **Duelos PvP:** Vitórias competitivas 1x1 e Pontos de Glória conquistados no Coliseu.
6. 🏁 **Corridas da Turma:** Pódio das corridas coletivas ao vivo disparadas pelo professor.

- **Arquitetura 100% Spark-Safe (Custo Zero):** Todas as 6 métricas são consolidadas no mesmo documento de `/leaderboard/{userId}` sem escritas adicionais. Ao alternar entre abas, a ordenação ocorre **100% em memória no cliente (`useMemo`)**, resultando em **0 leituras extras de banco** e transição instantânea de 0ms.
- **Filtros Pedagógicos Integrados:** Filtros por Série (6º ao 9º ano, Ensino Médio), Turma específica, atalho "Minha Série" e cálculo dinâmico da colocação do próprio aluno em cada métrica.
- **Exclusão Estrita de Professores:** Docentes e administradores nunca aparecem em nenhuma das 6 abas de classificação.

### 🥇 10. Radar de Pódio Top 3 na Barra Lateral (Live Dual-Timer)
Para manter a motivação competitiva em alta sem exigir que os estudantes abram menus repetidamente:
- **Pódio Contínuo no Canto Esquerdo:** Widget estilizado integrado diretamente na barra lateral de status (`StatsSidebar.tsx`), exibindo os 3 melhores alunos (🥇, 🥈, 🥉) com seus avatares, apelidos, turmas e pontuações em tempo real.
- **Cronômetro 1 — Rotação Visual Local (12s):** A cada 12 segundos, o widget rotaciona automaticamente e suavemente entre as 6 métricas de ranking na memória do cliente com barra de progresso visual e controles manuais de avançar, voltar e pausar. Custo de banco: **0 leituras**.
- **Cronômetro 2 — Sincronização Cloud em Background (3 min):** Atualiza os dados da nuvem em segundo plano a cada 180 segundos. Com 100 alunos ativos, gera apenas 1.500 leituras/aula (3% do limite diário do Spark).
- **Congelamento Inteligente:** O timer é automaticamente pausado quando a aba do navegador perde o foco (`document.hidden`), eliminando qualquer leitura ociosa fora da aula.
- **Acesso Rápido com 1 Clique:** Clicar em qualquer competidor do pódio abre o `LeaderboardModal` diretamente na aba daquela métrica.

---

## 🏫 Gestão Escolar & Painel do Professor

O sistema possui uma suíte administrativa restrita acessível apenas por docentes autorizados (Super Admin: `wrobel.marcos@gmail.com`):

### 🔒 1. Trava do Laboratório (Sessão Controlada)
- O professor pode fechar o acesso ao jogo fora do horário de aula.
- **Código de Sessão na Lousa:** O docente gera um código de 4 dígitos (ex: `A5F9`) com validade configurável (1h, 2h ou 4h).
- **Tela de Espera Inteligente:** Alunos veem um aviso de aguardo com botão interativo *"Clique para Inserir o Código"*, permitindo liberação rápida em sala de aula.

### 📊 2. Relatórios e Métricas em Tempo Real
- Visualização de desempenho da turma: Palavras por Minuto (PPM), Acurácia (%), Nível alcançado e Bytes acumulados.
- Filtro imediato por turma (ex: 6º A, 7º B, 8º C, etc.).
- Identificação discreta de padrões atípicos de digitação para acompanhamento individual do professor.

### 💾 3. Backups e Proteção de Dados
- **Backup Local em JSON:** Download e upload instantâneo de arquivos de progresso.
- **Snapshots na Nuvem:** Criação de pontos de restauração diretamente no Firestore com rollback em 1 clique.
- **Gestão de Professores:** Inclusão e revogação de acessos de outros docentes do colégio.

### 🏁 4. Controle de Corridas Escolares em Tempo Real
- **Painel de Telemetria ao Vivo:** Monitoramento da corrida ativa com identificação do vencedor em tempo real, pódio de colocação dos concluintes, PPM de cada aluno e botão de encerramento/cancelamento de emergência.

---

## ☁️ Arquitetura de Sincronização e Custos Zero (Plano Spark)

O TypeClicker Educa foi desenhado para operar com **zero custo de infraestrutura**, respeitando com margem os limites do plano gratuito do Google Firebase:

| Métrica | Limite Gratuito Firebase (Spark) | Consumo Típico do TypeClicker (300 alunos/dia) |
| :--- | :--- | :--- |
| **Gravações Diárias (Writes)** | 20.000 / dia | ~1.500 a 3.000 / dia |
| **Leituras Diárias (Reads)** | 50.000 / dia | ~2.000 a 5.000 / dia |
| **Armazenamento de Dados** | 1.00 GB | < 25 MB para mais de 5.000 alunos |

### Estratégias de Engenharia Aplicadas:
1. **Debounce e Throttling:** O progresso em digitação é acumulado localmente e gravado no Firestore a cada 60 segundos (ou em eventos cruciais como subida de nível e logout).
2. **Buffer Offline Isolado por UID:** Evita conflito de dados em computadores compartilhados por múltiplos turnos de alunos no laboratório.
3. **Persistência Síncrona no Desligamento:** Captura de eventos `beforeunload` e `pagehide` para assegurar que nenhum Byte seja perdido ao fechar a tampa do notebook ou encerrar a sessão.
4. **Regras de Segurança Granulares (`firestore.rules`):** Cada aluno possui permissão estrita de leitura e escrita apenas sobre o seu próprio documento (`isOwner(userId)`), bloqueando acessos não autorizados.

---

## 💻 Tecnologias Empregadas

- **Front-end:** [React 19](https://react.dev/) com [TypeScript 5](https://www.typescriptlang.org/)
- **Build & Dev:** [Vite 6](https://vitejs.dev/)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animações:** [Motion (Framer Motion)](https://motion.dev/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Backend & Auth:** [Google Firebase](https://firebase.google.com/) (Cloud Firestore e Firebase Authentication com Google Identity / `@escola`)
- **Áudio:** Web Audio API com sintetizadores nativos
- **Hospedagem:** Google Cloud Run (Containerizado via Docker / Node.js)

---

## 👥 Créditos e Realização

- **Instituição:** Colégio Estadual Leopoldina Bittencourt Pedroso (Curitiba / PR)
- **Orientação Pedagógica & Coordenação:** Professor Marcos Wrobel
- **Público-Alvo:** Estudantes do Ensino Fundamental e Médio
- **Finalidade:** Projeto pedagógico sem fins lucrativos voltado à inclusão digital e excelência tecnológica na rede pública de ensino.

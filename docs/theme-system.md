# Sistema de Temas Dinâmicos (Theme System)

O sistema de temas consolida a identidade visual cinematográfica do projeto em tokens semânticos centralizados e tipados, evitando o uso de valores arbitrários (magic values) no código CSS.

---

## 1. Módulos Temáticos Centralizados (`src/theme/`)

Todos os tokens são disponibilizados sob o objeto centralizado `theme` exportado de [src/theme/index.ts](file:///d:/Projetos%20-%20Desenvolvimento/Pessoal/Roleplay-System/roleplay-system/src/theme/index.ts).

### A. Cores Semânticas (`colors.ts`)
*   **tons escuros do mapa (`mapDarkness`)**: Níveis graduais de escuridão profunda (`light`, `medium`, `dark`) para mesclagens gradientes do tabuleiro.
*   **tons escuros da névoa (`fogDarkness`)**: Separação semântica entre a visão opaca do Jogador (`player` com escuridão total `#030304`) e do Mestre (`gm` com escuridão translúcida `#03030490`).

### B. Movimento e Animações (`motion.ts`)
*   **curvas de atenuação (`ease`)**: Definição da curva de interpolação bezier cinematográfica: `cinematic: 'cubic-bezier(0.2, 0.8, 0.2, 1)'`.
*   **tempos de transição (`timing`)**: Padrões de duração para pan de câmera, fades de luzes focais (`lightTransition`) e reações visuais (`cinematicTransition`).

### C. Profundidade e Glows (`depth.ts`)
*   **sombras embutidas (`shadows.ts`)**: Efeitos de sombreamento periférico de tela para simular claustrofobia e profundidade.
*   **brilhos de tokens (`glows.ts`)**: Brilhos externos para indicar seleção ativa (`tokenSelected`), token inativo (`tokenDefault`) ou arrasto ativo (`tokenActive`).

### D. Camadas Visuais Dinâmicas (`zIndex.ts`)
Para evitar que elementos de HUD fiquem acidentalmente atrás do mapa ou que a névoa encubra botões de configurações, todos os níveis de elevação z-index são absolutos e sequenciais:

| Nível / Chave | Valor Z-Index | Descrição |
| :--- | :--- | :--- |
| `map` | `0` | Imagem física do mapa de batalha de fundo |
| `fog` | `10` | Camada de renderização da Névoa de Guerra (FOW) |
| `spotlight` | `20` | Máscaras de holofotes e iluminação direcional |
| `token` | `30` | Fichas de personagens repousando no mapa |
| `ping` | `40` | Sinalizações expansivas e alertas visuais |
| `tokenDragging` | `50` | Ficha em estado ativo de movimentação (sobe acima de outras) |
| `hud` | `100` | Barra de ferramentas inferior, títulos e controles primários |
| `sidebar` | `120` | Painéis flutuantes e resize handles laterais |
| `overlay` | `150` | Telas de carregamento, modais ou mensagens de erro |

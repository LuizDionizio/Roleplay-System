# Padrões e Diretrizes de Codificação (Coding Standards)

Este guia estabelece os padrões técnicos de estruturação de código, nomenclatura de componentes/funções e as políticas de desempenho do ecossistema do Roleplay System.

---

## 1. Diretrizes de Comentários

*   **Língua Oficial**: Todos os cabeçalhos de sistema, explicações matemáticas complexas de física/transformação e decisões arquiteturais de design devem ser comentados em **Português**.
*   **Comentários de Responsabilidade**: Cada arquivo de sistema relevante ou helper core deve iniciar com um bloco documentando explicitamente:
    1.  Qual a responsabilidade primária do arquivo/módulo.
    2.  O que o arquivo/módulo explicitamente **NÃO** faz.
*   **Evitar Comentários Óbvios**: Não documente sintaxe JavaScript/TypeScript óbvia.
    *   *Ruim*: `// Define variável x de valor 10`
    *   *Bom*: `// Raio limite para filtrar pings repetidos do ponteiro`

---

## 2. Padrões de Nomenclatura

### A. Funções e Métodos de Ação
Evite verbos genéricos e vagos como `updateStuff()`, `handleThing()`. Use termos que descrevam explicitamente a ação semântica e o domínio da alteração:

*   *Evitar*: `handlePointerMove()`, `updateFog()`, `changeZoom()`
*   *Preferir*: `calculateViewportTransform()`, `resolveFogVisibility()`, `constrainScale()`

### B. Convenções de Arquivos e Pastas
*   **Componentes Visuais React**: PascalCase com extensão `.tsx` (ex: `MapLayer.tsx`, `NarrativeToolbar.tsx`).
*   **Hooks e Arquivos Lógicos**: camelCase com extensão `.ts` (ex: `interactionContext.tsx`, `helpers.ts`, `pingSystem.ts`).
*   **Organização de Diretórios**:
    *   `src/core/`: Funcionalidades agnósticas de baixo nível (ex: viewport, input normalizers).
    *   `src/systems/`: Estados de domínio lógico do RPG e atmosfera.
    *   `src/components/`: Elementos puros de representação e interface visual.

---

## 3. Filosofia de Responsabilidade de Componentes

*   **Componentes Burros/Composição de UI**: Os componentes em `src/components/` devem se concentrar em receber dados (props), compor elementos estruturais DOM/SVG, aplicar estilizações via tokens de tema e disparar eventos. Eles **não** devem conter regras de negócio complexas, cálculos trigonométricos ou mutações lógicas de dados.
*   **Lógica Descentralizada**: Cálculos geométricos, distância euclidiana de proximidade, tratamento de pincéis ou temporizadores de pings devem morar em arquivos isolados de utilitários (`src/core/`) ou ganchos especialistas de sistema (`src/systems/`).

---

## 4. Diretrizes de Desempenho e Re-renderizações

1.  **Proteção contra Atualizações de Fluxo (Input Flood)**:
    Sempre que escutar eventos contínuos de ponteiro (wheel, movement, resizing), acumule as mudanças físicas e processe os despachos de estado do React sob o controle de ciclos de animação utilizando `requestAnimationFrame`.
2.  **Memoização de Camadas de Exibição**:
    Cada camada gráfica do tabuleiro (`MapLayer`, `FogLayer`, `TokenLayer`, `EnvironmentLayer`) deve ser embrulhada em `React.memo` para assegurar que atualizações de estado localizadas (ex: adicionar um ping ou arrastar um token específico) não façam o React reavaliar a árvore de renderização inteira do tabuleiro virtual.
3.  **Referência Estável de Callbacks**:
    Todos os despachos de modificação de dados fornecidos por ganchos (`useCallback`) devem declarar corretamente suas dependências de variáveis para evitar stale states, preservando a estabilidade das funções transmitidas via props.

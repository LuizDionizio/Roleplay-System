/**
 * ============================================================================
 * NÚCLEO DE INTERAÇÃO - RESOLVEDOR DE FERRAMENTAS (interactionCore / toolResolver)
 * ============================================================================
 * 
 * RESPONSABILIDADE:
 * - Traduzir a combinação de estado de teclas modificadoras (como Barra de Espaço),
 *   ferramenta selecionada no HUD e estados de arrasto ativos (tokens)
 *   em um Modo de Interação Físico concreto e mutuamente exclusivo.
 * - Evitar conflitos de múltiplos gestos concorrentes.
 * 
 * O QUE NÃO FAZ:
 * - Não escuta ou manipula eventos diretamente.
 * - Não altera estados do React.
 * ============================================================================
 */

import type { ToolMode } from '../../systems/perspective/types';
import type { InteractionMode } from './interactionModes';

/**
 * Resolve o Modo de Interação Físico ativo com prioridades rígidas:
 * 1. Se a barra de espaço estiver pressionada -> Sempre modo de navegação ('explore').
 * 2. Se houver um token sendo arrastado -> Sempre modo de arrasto de token ('token-drag').
 * 3. Caso contrário, mapeia diretamente a ferramenta ativa do HUD correspondente.
 */
export function resolveInteractionMode(
  activeTool: ToolMode,
  isSpacePressed: boolean,
  draggingTokenId: string | null
): InteractionMode {
  if (isSpacePressed) {
    return 'explore';
  }
  if (draggingTokenId) {
    return 'token-drag';
  }

  switch (activeTool) {
    case 'fog':
      return 'fog-draw';
    case 'spotlight':
      return 'spotlight-place';
    case 'ping':
      return 'ping-place';
    case 'explore':
    default:
      return 'explore';
  }
}

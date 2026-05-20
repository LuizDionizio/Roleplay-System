/**
 * ============================================================================
 * NÚCLEO DE INTERAÇÃO - GUARDAS DE ENTRADA (interactionCore / inputGuards)
 * ============================================================================
 * 
 * RESPONSABILIDADE:
 * - Evitar que cliques direcionados a botões do HUD, painéis laterais de chat,
 *   barras de ferramentas ou caixas de texto causem efeitos espaciais indesejados
 *   no mapa (como pan indesejado, disparo de pings ou revelação acidental de névoa).
 * - Identificar se um elemento DOM interceptado possui foco ou semântica interativa.
 * 
 * O QUE NÃO FAZ:
 * - Não gerencia foco de teclado ou manipula elementos DOM.
 * ============================================================================
 */

/**
 * Retorna true se o elemento DOM clicado for explicitamente interativo,
 * impedindo que o evento de clique vaze para o plano do mapa abaixo dele.
 */
export function isInteractiveElement(target: HTMLElement | null): boolean {
  if (!target) return false;
  
  // Elementos marcados com classe CSS 'pointer-events-auto' ou tags nativas de controle/formulário
  return (
    !!target.closest('.pointer-events-auto') ||
    target.tagName === 'BUTTON' ||
    target.tagName === 'INPUT' ||
    target.tagName === 'SELECT' ||
    target.tagName === 'TEXTAREA'
  );
}

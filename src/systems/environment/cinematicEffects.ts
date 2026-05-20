/**
 * ============================================================================
 * SISTEMA ESPACIAL - EFEITOS CINEMATOGRÁFICOS (cinematicEffects)
 * ============================================================================
 * 
 * RESPONSABILIDADE:
 * - Computar estilos CSS (React.CSSProperties) para a renderização de efeitos 
 *   cinematográficos, como a vinheta dinâmica.
 * - Simular sensação de profundidade de campo (Depth of Field) ao escurecer as bordas
 *   quando o usuário interage diretamente com elementos críticos (como arrastar um token).
 * 
 * O QUE NÃO FAZ:
 * - Não gerencia estado ou causa re-renderizações (são funções auxiliares puras).
 * ============================================================================
 */

import type { EnvironmentalConfig } from './types';
import type React from 'react';
import { theme } from '../../theme';

/**
 * Calcula os estilos CSS dinâmicos da vinheta com base na intensidade ambiental
 * e no estado de foco (ex: token em arrasto ativa um escurecimento das bordas).
 */
export function getVignetteStyles(config: EnvironmentalConfig, isFocusing: boolean): React.CSSProperties {
  // Se estiver focando, aumenta a intensidade da vinheta para destacar o centro da tela
  const effectiveIntensity = isFocusing ? Math.min(1, config.vignetteIntensity + 0.25) : config.vignetteIntensity;
  
  // Opacidades intermediárias e de borda
  const edgeOpacity = Math.min(1, 0.4 + (effectiveIntensity * 0.6));
  const midOpacity = effectiveIntensity * 0.3;
  
  return {
    background: `radial-gradient(ellipse at center, transparent 0%, transparent ${isFocusing ? '35%' : '40%'}, rgba(8,8,10,${midOpacity}) 75%, rgba(8,8,10,${edgeOpacity}) 100%)`,
    transition: `background ${theme.motion.timing.cinematicTransition} ${theme.motion.ease.cinematic}`,
  };
}

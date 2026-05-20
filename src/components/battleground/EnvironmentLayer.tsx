/**
 * ============================================================================
 * CAMADA DE RENDERIZAÇÃO - EFEITOS E ILUMINAÇÃO AMBIENTAL (EnvironmentLayer)
 * ============================================================================
 * 
 * RESPONSABILIDADE:
 * - Renderizar efeitos atmosféricos gerais de iluminação e vinhetas multiplicativas (mix-blend-multiply).
 * - Renderizar sombras projetadas periféricas de borda (Ambient Inset).
 * - Oferecer visual imersivo de iluminação cinematográfica que reage ao contexto de cena.
 * 
 * O QUE NÃO FAZ:
 * - Não computa as fórmulas de vinheta dinâmicas ou o estado de foco do mouse.
 *   (esses estilos já vêm computados pela propriedade `vignetteStyles`).
 * ============================================================================
 */

import { memo } from 'react';
import type React from 'react';
import { theme } from '../../theme';

interface EnvironmentLayerProps {
  vignetteStyles: React.CSSProperties;
}

export const EnvironmentLayer = memo(function EnvironmentLayer({ vignetteStyles }: EnvironmentLayerProps) {
  return (
    <>
      {/* Vinheta Atmosférica de Canto com Mesclagem de Multiplicação (mix-blend-multiply) */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-multiply"
        style={vignetteStyles}
      />

      {/* Gradientes adicionais de iluminação de centro e borda do tema */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: theme.effects.gradients.vignetteCenter }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: theme.effects.gradients.vignetteBorder }}
      />
      
      {/* Sombra ambiental embutida nos cantos da tela */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: theme.depth.shadows.ambientInset }}
      />
    </>
  );
});

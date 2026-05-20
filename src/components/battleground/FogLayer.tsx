/**
 * ============================================================================
 * CAMADA DE RENDERIZAÇÃO - NÉVOA DE GUERRA (FogLayer)
 * ============================================================================
 * 
 * RESPONSABILIDADE:
 * - Acoplar a lógica de revelação e obscurecimento da névoa de guerra ao fluxo React.
 * - Delegar a montagem de máscaras alfa para o componente `<FogOverlay />`.
 * 
 * O QUE NÃO FAZ:
 * - Não faz computações de visibilidade ou armazena o histórico de traços da escova.
 * - Não ouve eventos físicos de cliques.
 * ============================================================================
 */

import { memo } from 'react';
import { FogOverlay } from '../../systems/fog/FogOverlay';
import type { FogState } from '../../systems/fog/types';
import type { PerspectiveState } from '../../systems/perspective/types';

interface FogLayerProps {
  fogState: FogState;
  perspectiveState: PerspectiveState;
}

export const FogLayer = memo(function FogLayer({ fogState, perspectiveState }: FogLayerProps) {
  return (
    <FogOverlay
      isActive={fogState.isActive}
      revealedZones={fogState.revealedZones}
      viewMode={perspectiveState.viewMode}
    />
  );
});

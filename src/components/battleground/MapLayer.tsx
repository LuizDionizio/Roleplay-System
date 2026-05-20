/**
 * ============================================================================
 * CAMADA DE RENDERIZAÇÃO - MAPA E GRADE (MapLayer)
 * ============================================================================
 * 
 * RESPONSABILIDADE:
 * - Renderizar a imagem física do mapa de batalha de fundo.
 * - Renderizar a grade visual de combate tático (Grid Overlay).
 * - Registrar a referência do elemento HTML da imagem de mapa com o núcleo
 *   de interação para possibilitar o cálculo matemático de coordenadas reais.
 * 
 * O QUE NÃO FAZ:
 * - Não escuta gestos do mouse diretamente ou executa lógica de movimentação de câmera.
 * ============================================================================
 */

import { useEffect, useRef } from 'react';
import { useInteraction } from '../../core/interaction/interactionContext';

interface MapLayerProps {
  mapImage: string;
}

export function MapLayer({ mapImage }: MapLayerProps) {
  const { registerMapImageRef } = useInteraction();
  const ref = useRef<HTMLImageElement | null>(null);

  // Registra a referência do elemento no mount para uso nas contas matemáticas de conversão tela-mundo
  useEffect(() => {
    registerMapImageRef(ref);
  }, [registerMapImageRef]);

  return (
    <>
      {/* Imagem do mapa de batalha de fundo */}
      <img
        ref={ref}
        src={mapImage}
        alt="Battleground Map"
        className="absolute inset-0 h-full w-full object-cover"
        onContextMenu={(e) => {
          e.preventDefault(); // Desabilita menu de contexto na imagem do mapa
        }}
      />

      {/* Grade tática (Grid) semi-transparente sobreposta ao mapa */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[length:48px_48px] bg-[linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)]"
      />
    </>
  );
}

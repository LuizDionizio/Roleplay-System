/**
 * ============================================================================
 * CAMADA DE RENDERIZAÇÃO - ALERTAS ESPACIAIS / PINGS (PingLayer)
 * ============================================================================
 * 
 * RESPONSABILIDADE:
 * - Renderizar ondas concêntricas animadas (ping ripples) no mapa de batalha.
 * - Utilizar tokens de tema para a escala de cores, glows e tempos de animação.
 * 
 * O QUE NÃO FAZ:
 * - Não gerencia a lista lógica de pings ou dispara temporizadores de expiração.
 * - Não reage a gestos do mouse diretamente.
 * ============================================================================
 */

import { memo } from 'react';
import type { PingData } from '../../systems/spatial/types';
import { theme } from '../../theme';

interface PingLayerProps {
  pings: PingData[];
}

export const PingLayer = memo(function PingLayer({ pings }: PingLayerProps) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: theme.zIndex.ping }}
    >
      {pings.map((ping) => {
        // Escolhe a cor base do ping baseando-se no tema semântico configurado
        const colorValue = ping.color === 'red' ? '#ef4444' : theme.colors.amber[400];
        
        return (
          <div
            key={ping.id}
            className="absolute flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
            style={{
              left: ping.position.x,
              top: ping.position.y,
            }}
          >
            {/* Núcleo central do ping */}
            <div
              className="absolute size-4 rounded-full"
              style={{
                backgroundColor: colorValue,
                boxShadow: theme.depth.glows.pingCore,
              }}
            />
            
            {/* Primeira onda expansiva (Ripple 1) */}
            <div
              className="absolute rounded-full border animate-ping"
              style={{
                borderColor: colorValue,
                animationDuration: '1.2s',
                width: '120px',
                height: '120px',
              }}
            />

            {/* Segunda onda expansiva atrasada (Ripple 2) */}
            <div
              className="absolute rounded-full border animate-ping"
              style={{
                borderColor: colorValue,
                animationDuration: '1.2s',
                animationDelay: '0.4s',
                width: '80px',
                height: '80px',
              }}
            />
          </div>
        );
      })}
    </div>
  );
});

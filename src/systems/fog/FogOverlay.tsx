/**
 * ============================================================================
 * SISTEMA NARRATIVO - PREENCHIMENTO E MÁSCARAS DE NÉVOA (FogOverlay)
 * ============================================================================
 * 
 * RESPONSABILIDADE:
 * - Renderização visual da névoa de guerra sobre o mapa utilizando SVG e máscaras alfa (`<mask>`).
 * - Alterar a opacidade da névoa dinamicamente baseada na visão do Mestre (GM) ou Jogador (Player).
 * - Aplicar um gradiente radial suave (`#fog-reveal-gradient`) ao redor das zonas reveladas
 *   para criar bordas de revelação realistas e ambientais.
 * 
 * O QUE NÃO FAZ:
 * - Não faz checagens lógicas de visibilidade (não lê tokens ou coordenadas lógicas).
 * - Não gerencia estado de escovas ou tamanhos de pincéis.
 * ============================================================================
 */

import type { RevealZone } from './types';
import type { ViewMode } from '../perspective/types';
import { theme } from '../../theme';

interface FogOverlayProps {
  isActive: boolean;
  revealedZones: RevealZone[];
  viewMode: ViewMode;
}

export function FogOverlay({ isActive, revealedZones, viewMode }: FogOverlayProps) {
  // O Mestre vê a névoa com opacidade reduzida para fins de planejamento do cenário.
  // O Jogador vê a névoa com escuridão absoluta para simular mistério e perigo.
  const fillColor = viewMode === 'gm' ? theme.colors.fogDarkness.gm : theme.colors.fogDarkness.player;

  return (
    <div
      className={`absolute inset-0 pointer-events-none transition-cinematic ${
        isActive ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ zIndex: theme.zIndex.fog }}
    >
      {/* 
        O SVG de sobreposição se estende para fora dos limites padrão para garantir 
        que a névoa preencha toda a tela mesmo sob deslocamento máximo de pan ou escalas de zoom extremas.
      */}
      <svg
        className="absolute inset-0 h-full w-full"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Gradiente radial de atenuação: preto (0 opacidade na máscara) corta a névoa revelando o mapa. */}
          <radialGradient id="fog-reveal-gradient">
            <stop offset="0%" stopColor="black" stopOpacity="1" />
            <stop offset="35%" stopColor="black" stopOpacity="0.85" />
            <stop offset="70%" stopColor="black" stopOpacity="0.3" />
            <stop offset="100%" stopColor="black" stopOpacity="0" />
          </radialGradient>

          {/* Máscara de névoa: o branco preenche, o gradiente radial preto abre os buracos espaciais */}
          <mask id="fog-mask">
            {/* O retângulo branco preenche toda a extensão inicial com névoa opaca */}
            <rect x="-10000" y="-10000" width="20000" height="20000" fill="white" />
            
            {/* Círculos gerados a partir do vetor lógico, aplicando a máscara de corte */}
            {revealedZones.map((zone) => (
              <circle
                key={zone.id}
                cx={zone.position.x}
                cy={zone.position.y}
                r={zone.radius}
                fill="url(#fog-reveal-gradient)"
              />
            ))}
          </mask>
        </defs>

        {/* Retângulo de cor final que cobre o mapa sob o efeito da máscara processada acima */}
        <rect
          x="-10000"
          y="-10000"
          width="20000"
          height="20000"
          fill={fillColor}
          mask="url(#fog-mask)"
          className="transition-all duration-1000"
        />
      </svg>
    </div>
  );
}

/**
 * ============================================================================
 * SISTEMA ESPACIAL - SINALIZAÇÃO TEMPORÁRIA (pingSystem)
 * ============================================================================
 * 
 * RESPONSABILIDADE:
 * - Registrar sinalizações de localização (Pings) temporárias emitidas pelos usuários.
 * - Gerenciar a vida útil lógica do ping, programando sua auto-remoção do estado.
 * 
 * O QUE NÃO FAZ:
 * - Não desenha as ondas e círculos animados de ripple no CSS.
 *   (delega para a camada visual `<PingLayer />`).
 * ============================================================================
 */

import { useState, useCallback } from 'react';
import type { PingData, WorldPosition } from './types';

const DEFAULT_PING_DURATION = 2500; // Tempo de exibição de 2.5 segundos

export function usePingSystem() {
  const [pings, setPings] = useState<PingData[]>([]);

  /**
   * Adiciona um novo ping de alerta visual no mapa na coordenada informada
   * e configura um temporizador assíncrono para expirá-lo automaticamente.
   */
  const addPing = useCallback((position: WorldPosition, color: string = 'amber') => {
    const id = `ping-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newPing: PingData = {
      id,
      position,
      timestamp: Date.now(),
      duration: DEFAULT_PING_DURATION,
      color,
    };
    
    setPings((current) => [...current, newPing]);

    // Agenda a limpeza automática do ping após o encerramento de sua duração nominal
    setTimeout(() => {
      setPings((current) => current.filter((p) => p.id !== id));
    }, DEFAULT_PING_DURATION);
  }, []);

  return { pings, addPing };
}

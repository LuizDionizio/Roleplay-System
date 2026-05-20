# Núcleo Espacial (Spatial Core) - Funcionamento Matemático

O sistema de exibição de mapa do Battleground permite translações livres de câmera (pan) e aproximações/afastamentos graduais (zoom). Este documento documenta a matemática envolvida na conversão de coordenadas físicas de tela para coordenadas lógicas de tabuleiro.

---

## 1. Dois Espaços de Coordenadas

1.  **Espaço de Tela (Screen/Viewport Space)**: Coordenadas brutas em pixels fornecidas pelos eventos do navegador (`clientX`, `clientY`). Elas se iniciam no canto superior esquerdo da tela física (0, 0) e variam de acordo com o tamanho da janela de visualização do navegador.
2.  **Espaço de Mundo (World Space)**: Coordenadas lógicas associadas diretamente ao plano cartesiano do mapa de batalha. As posições lógicas de tokens, raios dos pincéis da névoa de guerra e pings espaciais são calculados e armazenados neste espaço de forma imutável, independente do fator de zoom atual da câmera.

---

## 2. Algoritmos de Conversão

### A. Conversão de Tela para Mundo (Screen to World)
Usada quando o usuário interage na tela física (ex: clica no mapa, inicia um arrasto de token ou pincela a névoa) e precisamos mapear onde esse clique ocorreu no espaço cartesiano lógico do mapa.

**Fórmula matemática:**
$$X_{mundo} = \frac{X_{tela} - Left_{mapa}}{Escala}$$
$$Y_{mundo} = \frac{Y_{tela} - Top_{mapa}}{Escala}$$

Onde:
*   $X_{tela}$ / $Y_{tela}$ são as posições de clique do ponteiro do mouse (`clientX`, `clientY`).
*   $Left_{mapa}$ / $Top_{mapa}$ são os recuos físicos da imagem do mapa na viewport (`rect.left`, `rect.top`).
*   $Escala$ é o fator de magnificação ou redução visual ativa (`scale`).

**Código de implementação**:
```typescript
export function screenToWorld(
  clientX: number,
  clientY: number,
  rect: DOMRect | { left: number; top: number },
  scale: number
): WorldPosition {
  return {
    x: (clientX - rect.left) / scale,
    y: (clientY - rect.top) / scale,
  };
}
```

---

## 3. Limitação Espacial de Câmera

Para evitar que o usuário perca o mapa de vista ao arrastar a câmera muito longe, o sistema aplica clamps baseados em constantes espaciais padrão:

*   **Fator de escala máximo/mínimo (`scale`)**: Clampeado entre `0.5x` (zoom out) e `3.0x` (zoom in).
*   **Limites de Pan horizontal/vertical**: Restringidos entre `-1500px` e `1500px` em relação ao centro de origem do palco.

**Fórmula de restrição:**
$$Pan_{clampeado} = \max(MinPan, \min(Pan_{proposto}, MaxPan))$$

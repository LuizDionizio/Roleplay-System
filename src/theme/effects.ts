export const effects = {
  gradients: {
    backdrop: 'radial-gradient(ellipse 90% 55% at 50% -10%, rgba(146,103,35,0.14), transparent 55%), radial-gradient(ellipse 50% 35% at 0% 100%, rgba(69,26,3,0.1), transparent 50%), radial-gradient(ellipse 40% 30% at 100% 80%, rgba(28,25,23,0.9), transparent 60%)',
    vignetteCenter: 'radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(8,8,10,0.2) 75%, rgba(8,8,10,0.85) 100%)',
    vignetteBorder: 'linear-gradient(180deg, rgba(12,10,8,0.4) 0%, transparent 10%, transparent 90%, rgba(8,8,10,0.6) 100%)',
    spotlightMask: (radius: number, lightColor: string, midColor: string, darkColor: string) =>
      `radial-gradient(circle ${radius}px at center, transparent 0%, ${lightColor} 30%, ${midColor} 70%, ${darkColor} 100%)`,
    pingCore: 'radial-gradient(circle, transparent 20%, rgba(251,191,36,0.2) 100%)',
  },
};

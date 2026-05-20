export const motion = {
  timing: {
    slow: '500ms',
    normal: '300ms',
    fast: '150ms',
    cinematicTransition: '800ms',
    lightTransition: '1000ms',
  },
  ease: {
    cinematic: 'cubic-bezier(0.2, 1, 0.2, 1)',
    ui: 'cubic-bezier(0.4, 0, 0.2, 1)',
    ripple: 'cubic-bezier(0, 0, 0.2, 1)',
  },
  transition: {
    cinematic: 'all 500ms cubic-bezier(0.2, 1, 0.2, 1)',
    ui: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    hover: 'color 150ms cubic-bezier(0.4, 0, 0.2, 1), background-color 150ms cubic-bezier(0.4, 0, 0.2, 1), border-color 150ms cubic-bezier(0.4, 0, 0.2, 1), text-decoration-color 150ms cubic-bezier(0.4, 0, 0.2, 1), fill 150ms cubic-bezier(0.4, 0, 0.2, 1), stroke 150ms cubic-bezier(0.4, 0, 0.2, 1), opacity 150ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1), transform 150ms cubic-bezier(0.4, 0, 0.2, 1), filter 150ms cubic-bezier(0.4, 0, 0.2, 1), backdrop-filter 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

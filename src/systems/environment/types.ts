export type EnvironmentalMotionStyle = 'drifting' | 'breathing' | 'static';

export interface EnvironmentalConfig {
  motionStyle: EnvironmentalMotionStyle;
  motionIntensity: number; // e.g., 0.5 for subtle, 1.0 for standard
  vignetteIntensity: number; // e.g., 0.8 for horror, 0.4 for exploration
  pulseIntensity: number; // For tense moments
}

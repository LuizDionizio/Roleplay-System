import { colors } from './colors';
import { motion } from './motion';
import { depth } from './depth';
import { atmosphere } from './atmosphere';
import { typography } from './typography';
import { zIndex } from './zIndex';
import { effects } from './effects';

export const theme = {
  colors,
  motion,
  depth,
  atmosphere,
  typography,
  zIndex,
  effects,
};

export type Theme = typeof theme;

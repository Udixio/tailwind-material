import { Theme } from '../main';

export interface ExtendTheme {
  updateTheme: (theme: Theme) => Theme;
}

import { PluginsConfig } from 'tailwindcss/types/config';

export type Theme = {
  colors: Record<string, string>;
  fontFamily: { expressive: string[]; neutral: string[] };
  plugins: Partial<PluginsConfig>;
};

export interface ExtendTheme {
  updateTheme: (theme: Theme) => Theme;
}

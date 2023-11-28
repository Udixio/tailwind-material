import { PluginCreator } from 'tailwindcss/types/config';
import { Config } from 'tailwindcss';

export interface Theme {
  colors: Record<string, string>;
  fontFamily: { expressive: string[]; neutral: string[] };
  plugins: { handler: PluginCreator; config?: Partial<Config> | undefined }[];
}

export interface ExtendTheme {
  updateTheme: (theme: Theme) => Theme;
}

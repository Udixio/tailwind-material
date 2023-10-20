import { materialTheme, Variant } from './material-theme';
import { darkTheme } from './dark-theme';
import { materialStates } from './material-states';
import { materialFonts } from './material-fonts';
import { Config } from 'tailwindcss';

export const createMaterialTheme = (
  colorsMap: { primary: any; secondary?: string; tertiary?: string },
  darkMode: null | 'class' | 'media',
  variant?: Variant
) => {
  let colors: Record<string, string> = materialTheme(colorsMap, variant);
  const plugins: {
    handler: any;
    config?: Partial<Config> | undefined;
  }[] = [];

  const states = materialStates();
  plugins.push(states.plugin);

  if (darkMode) {
    const theme = darkTheme(colors, darkMode);
    colors = theme.colors;
    plugins.push(theme.plugin);
  }

  const fonts = materialFonts();
  plugins.push(fonts.plugin);

  return { colors: colors, fontFamily: fonts.fontFamily, plugins: plugins };
};

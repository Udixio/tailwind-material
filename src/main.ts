import { MaterialTheme, MaterialThemeParams } from './material-theme';
import { darkTheme, DarkThemeParams } from './dark-theme';
import { materialStates } from './material-states';
import { materialFonts } from './material-fonts';
import { Config } from 'tailwindcss';

export interface createMaterialThemeParams
  extends MaterialThemeParams,
    Omit<DarkThemeParams, 'colors'> {}

export const createMaterialTheme = (params: createMaterialThemeParams) => {
  let colors: Record<string, string> = new MaterialTheme({
    colors: params.colors,
    variant: params.variant,
    contrastLevel: params.contrastLevel,
  }).generateTheme();
  const plugins: {
    handler: any;
    config?: Partial<Config> | undefined;
  }[] = [];

  const states = materialStates();
  plugins.push(states.plugin);

  if (params.darkMode) {
    const theme = darkTheme({
      colors: colors,
      darkMode: params.darkMode,
    });
    colors = theme.colors;
    plugins.push(theme.plugin);
  }

  const fonts = materialFonts();
  plugins.push(fonts.plugin);

  return { colors: colors, fontFamily: fonts.fontFamily, plugins: plugins };
};

import { MaterialTheme, MaterialThemeParams } from './theme/materialTheme';
import { darkTheme, DarkThemeParams } from './dark-theme';
import { materialStates } from './material-states';
import { materialFonts, MaterialFontsParams } from './material-fonts';
import { Config } from 'tailwindcss';

export interface createMaterialThemeParams
  extends MaterialThemeParams,
    Omit<DarkThemeParams, 'colors'>,
    MaterialFontsParams {}

export const createMaterialTheme = (args: createMaterialThemeParams) => {
  let colors: Record<string, string> = new MaterialTheme({
    colors: args.colors,
    variant: args.variant,
    contrastLevel: args.contrastLevel,
  }).generateTheme();
  const plugins: {
    handler: any;
    config?: Partial<Config> | undefined;
  }[] = [];

  const states = materialStates();
  plugins.push(states.plugin);

  if (args.darkMode) {
    const theme = darkTheme({
      colors: colors,
      darkMode: args.darkMode,
    });
    colors = theme.colors;
    plugins.push(theme.plugin);
  }

  const fonts = materialFonts({ fontFamily: args.fontFamily });
  plugins.push(fonts.plugin);

  return { colors: colors, fontFamily: fonts.fontFamily, plugins: plugins };
};

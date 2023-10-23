import { materialTheme, MaterialThemeParams } from './material-theme';
import { darkTheme, DarkThemeParams } from './dark-theme';
import { materialStates } from './material-states';
import { materialFonts } from './material-fonts';
import { Config } from 'tailwindcss';

type ColorsMapRenamed = {
  colors: MaterialThemeParams['colorsMap'];
};

export interface createMaterialThemeParams
  extends Omit<MaterialThemeParams, 'colorsMap'>,
    ColorsMapRenamed,
    Omit<DarkThemeParams, 'colors'> {}

export const createMaterialTheme = (params: createMaterialThemeParams) => {
  let colors: Record<string, string> = materialTheme({
    colorsMap: params.colors,
    variant: params.variant,
    contrastLevel: params.contrastLevel,
  });
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

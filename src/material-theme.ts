import {
  argbFromHex,
  DynamicColor,
  DynamicScheme,
  Hct,
  hexFromArgb,
  MaterialDynamicColors,
  TonalPalette,
} from '@material/material-color-utilities';

export enum Variant {
  MONOCHROME,
  NEUTRAL,
  TONAL_SPOT,
  VIBRANT,
  EXPRESSIVE,
  FIDELITY,
  CONTENT,
  RAINBOW,
  FRUIT_SALAD,
}

type MaterialDynamicColorsType = {
  [key: string]: DynamicColor;
};

interface ColorOptions {
  primary: string;
  secondary?: string;
  tertiary?: string;
  neutral?: string;
  neutralVariant?: string;
}

export interface MaterialThemeParams {
  colorsMap: { [key: string]: string } & ColorOptions;
  variant?: Variant;
  contrastLevel?: number;
}

export const materialTheme = ({
  colorsMap,
  variant = Variant.TONAL_SPOT,
  contrastLevel = 0,
}: MaterialThemeParams) => {
  if (!colorsMap.primary) {
    throw new Error('Primary color must be specified');
  }

  let argbColors: Record<string | keyof ColorOptions, number | undefined> = {
    primary: undefined,
    secondary: undefined,
    tertiary: undefined,
    neutral: undefined,
    neutralVariant: undefined,
  };

  for (const colorKey in colorsMap) {
    argbColors[colorKey] = colorsMap[colorKey]
      ? argbFromHex(colorsMap[colorKey])
      : undefined;
  }

  const tonalPalettes: { [key: string]: TonalPalette } = {};

  for (const colorKey in argbColors) {
    if (argbColors[colorKey] !== undefined) {
      tonalPalettes[colorKey] = TonalPalette.fromHct(
        Hct.fromInt(<number>argbColors[colorKey])
      );
    } else {
      tonalPalettes[colorKey] = TonalPalette.fromHct(
        Hct.fromInt(argbColors.primary!)
      );
    }
  }

  const colors: Record<string, string> = {
    transparent: 'transparent',
    current: 'currentColor',
    black: '#000000',
    white: '#ffffff',
  };

  const MaterialDynamicColorsTyped: MaterialDynamicColorsType =
    MaterialDynamicColors as unknown as MaterialDynamicColorsType;

  ['light', 'dark'].forEach((theme) => {
    const scheme = new DynamicScheme({
      sourceColorArgb: argbColors.primary!,
      variant: variant,
      contrastLevel: contrastLevel,
      isDark: theme === 'dark',
      primaryPalette: tonalPalettes.primary,
      secondaryPalette: tonalPalettes.secondary,
      tertiaryPalette: tonalPalettes.tertiary,
      neutralPalette: tonalPalettes.neutral,
      neutralVariantPalette: tonalPalettes.neutralVariant,
    });

    for (let key in MaterialDynamicColorsTyped) {
      if (MaterialDynamicColorsTyped.hasOwnProperty(key)) {
        if (key !== 'contentAccentToneDelta' && !key.includes('Palette')) {
          const dynamicColor = MaterialDynamicColorsTyped[key];

          const argb = dynamicColor.getArgb(scheme);
          const hex = hexFromArgb(argb);
          const kebabCase = key.replace(/([A-Z])/g, '-$1').toLowerCase();

          colors[`${kebabCase}-${theme}`] = hex;
        }
      }
    }
  });
  return colors;
};

import {
  argbFromHex,
  DynamicColor,
  DynamicScheme,
  Hct,
  hexFromArgb,
  MaterialDynamicColors,
  SchemeExpressive,
  SchemeFidelity,
  SchemeMonochrome,
  SchemeNeutral,
  SchemeTonalSpot,
  SchemeVibrant,
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
  // RAINBOW,
  // FRUIT_SALAD,
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

interface dynamicColorOptions {
  name?: string;
  palette: (scheme: DynamicScheme) => TonalPalette;
  tone: (scheme: DynamicScheme) => number;
  isBackground?: boolean;
  background?: (scheme: DynamicScheme) => DynamicColor;
  secondBackground?: (scheme: DynamicScheme) => DynamicColor;
  contrastCurve?: {
    low: number;
    readonly normal: number;
    readonly medium: number;
    readonly high: number;
  };
  toneDeltaPair?: (scheme: DynamicScheme) => {
    roleA: DynamicColor;
    readonly roleB: DynamicColor;
    readonly delta: number;
    readonly polarity: 'darker' | 'lighter' | 'nearer' | 'farther';
    readonly stayTogether: boolean;
  };
}

export interface MaterialThemeParams {
  colors: {
    palette: ColorOptions & { [key: string]: string };
    dynamic?: { [key: string]: Partial<dynamicColorOptions> };
  };
  variant?: Variant;
  contrastLevel?: number;
}

export class MaterialTheme {
  colorsPalette: { [key: string]: string } & ColorOptions;
  argbColors: Record<string | keyof ColorOptions, number | undefined>;
  dynamicColors?: { [key: string]: Partial<dynamicColorOptions> };
  variant: Variant;
  contrastLevel: number;

  constructor({ colors, variant, contrastLevel }: MaterialThemeParams) {
    this.colorsPalette = colors.palette;
    this.variant = variant || Variant.TONAL_SPOT;
    this.contrastLevel = contrastLevel || 0;
    this.argbColors = {
      primary: undefined,
      secondary: undefined,
      tertiary: undefined,
      neutral: undefined,
      neutralVariant: undefined,
    };
    this.dynamicColors = colors.dynamic;
    if (!this.colorsPalette.primary) {
      throw new Error('Primary color must be specified');
    }
  }

  generateTheme = () => {
    for (const colorKey in this.colorsPalette) {
      this.argbColors[colorKey] = this.colorsPalette[colorKey]
        ? argbFromHex(this.colorsPalette[colorKey])
        : undefined;
    }

    const colorsList: Record<string, string> = {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000000',
      white: '#ffffff',
    };

    ['light', 'dark'].forEach((theme) => {
      const dynamicScheme = this.getDynamicScheme(theme === 'dark');

      let dynamicColors = this.getDynamicColors(dynamicScheme, theme == 'dark');
      Object.assign(colorsList, dynamicColors);
    });
    return colorsList;
  };

  getDynamicScheme(isDark: boolean) {
    const defaultTheme = this.getDynamicSchemeFromVariant(this.variant, {
      sourceColorHct: Hct.fromInt(this.argbColors.primary!),
      isDark: isDark,
      contrastLevel: this.contrastLevel,
    });
    const args = {
      sourceColorArgb: this.argbColors.primary!,
      variant: this.variant,
      contrastLevel: this.contrastLevel,
      isDark: isDark,
      primaryPalette: defaultTheme.primaryPalette,
      secondaryPalette: defaultTheme.secondaryPalette,
      tertiaryPalette: defaultTheme.tertiaryPalette,
      neutralPalette: defaultTheme.neutralPalette,
      neutralVariantPalette: defaultTheme.neutralVariantPalette,
    };

    Object.keys(this.argbColors).forEach((colorKey) => {
      if (this.argbColors[colorKey] && colorKey !== 'primary') {
        const colorTheme = this.getDynamicSchemeFromVariant(this.variant, {
          sourceColorHct: Hct.fromInt(this.argbColors[colorKey]!),
          isDark: isDark,
          contrastLevel: this.contrastLevel,
        });

        if (colorKey !== 'neutral' && colorKey !== 'neutralVariant') {
          (args as { [key: string]: any })[colorKey + 'Palette'] =
            colorTheme['primaryPalette'];
        } else {
          (args as { [key: string]: any })[colorKey + 'Palette'] = (
            colorTheme as { [key: string]: any }
          )[colorKey + 'Palette'];
        }
      }
    });

    return new DynamicScheme(args);
  }

  getDynamicSchemeFromVariant(
    variant: Variant,
    schemeOptions: {
      sourceColorHct: Hct;
      isDark: boolean;
      contrastLevel: number;
    }
  ) {
    switch (variant) {
      case Variant.MONOCHROME:
        return new SchemeMonochrome(
          schemeOptions.sourceColorHct,
          schemeOptions.isDark,
          schemeOptions.contrastLevel
        );
      case Variant.NEUTRAL:
        return new SchemeNeutral(
          schemeOptions.sourceColorHct,
          schemeOptions.isDark,
          schemeOptions.contrastLevel
        );
      case Variant.TONAL_SPOT:
        return new SchemeTonalSpot(
          schemeOptions.sourceColorHct,
          schemeOptions.isDark,
          schemeOptions.contrastLevel
        );
      case Variant.VIBRANT:
        return new SchemeVibrant(
          schemeOptions.sourceColorHct,
          schemeOptions.isDark,
          schemeOptions.contrastLevel
        );
      case Variant.EXPRESSIVE:
        return new SchemeExpressive(
          schemeOptions.sourceColorHct,
          schemeOptions.isDark,
          schemeOptions.contrastLevel
        );
      case Variant.FIDELITY:
        return new SchemeFidelity(
          schemeOptions.sourceColorHct,
          schemeOptions.isDark,
          schemeOptions.contrastLevel
        );
      case Variant.CONTENT:
        return new SchemeFidelity(
          schemeOptions.sourceColorHct,
          schemeOptions.isDark,
          schemeOptions.contrastLevel
        );
      // case Variant.RAINBOW:
      //   return new SchemeRainbow(
      //     schemeOptions.sourceColorHct,
      //     schemeOptions.isDark,
      //     schemeOptions.contrastLevel
      //   );
      // case Variant.FRUIT_SALAD:
      //   return new SchemeFruitSalad(
      //     schemeOptions.sourceColorHct,
      //     schemeOptions.isDark,
      //     schemeOptions.contrastLevel
      //   );
      default:
        throw new Error('Unsupported scheme variant');
    }
  }

  getDynamicColors(scheme: DynamicScheme, darkMode: boolean) {
    let dynamicColors: Record<string, string> = {};

    const MaterialDynamicColorsTyped: MaterialDynamicColorsType =
      MaterialDynamicColors as unknown as MaterialDynamicColorsType;

    for (let key in MaterialDynamicColorsTyped) {
      if (MaterialDynamicColorsTyped.hasOwnProperty(key)) {
        if (key !== 'contentAccentToneDelta' && !key.includes('Palette')) {
          let dynamicColorOptions: any = MaterialDynamicColorsTyped[key];
          if (this.dynamicColors) {
            if (this.dynamicColors[key]) {
              dynamicColorOptions = {
                ...dynamicColorOptions,
                ...this.dynamicColors[key],
              };
              console.log(key, dynamicColorOptions.tone());
            }
          }

          const dynamicColor = DynamicColor.fromPalette(dynamicColorOptions);
          const argb = dynamicColor.getArgb(scheme);
          const hex = hexFromArgb(argb);
          const kebabCase = key.replace(/([A-Z])/g, '-$1').toLowerCase();

          if (this.dynamicColors) {
            if (this.dynamicColors[key]) {
              console.log(key, hex);
            }
          }

          dynamicColors[`${kebabCase}-${darkMode ? 'dark' : 'light'}`] = hex;
        }
      }
    }

    return dynamicColors;
  }
}

import {
  argbFromHex,
  DynamicColor,
  DynamicScheme,
  Hct,
  hexFromArgb,
} from '@material/material-color-utilities';
import { createDynamicScheme, Variant } from './variant';
import {
  DynamicColorKey,
  MaterialDynamicColors,
} from './materialDynamicColors';
import { ExtendTheme, Theme } from '../utils';
import { Color, ColorOptions } from './color';
import { ExportableTheme, ThemeFigma } from '../figma';

export type PaletteColorKey =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'neutral'
  | 'neutralVariant';

export interface ColorThemeOption {
  colors: {
    palette: Record<'primary', string> &
      Partial<Record<PaletteColorKey, string>>;
    dynamic?: Partial<Record<DynamicColorKey, Partial<ColorOptions>>>;
  };
  variant?: Variant;
  contrastLevel?: number;
}

export class ColorTheme implements ExtendTheme, ExportableTheme {
  colorsPalette: Record<'primary', string> &
    Partial<Record<PaletteColorKey, string>>;
  // argbColors: Record<PaletteColorKey, number | undefined>;
  // _dynamicColorsOptions = new Map<DynamicColorKey, DynamicColorOptions>();
  colors: Map<DynamicColorKey, Color> = new Map();
  variant: Variant;
  contrastLevel: number;

  constructor({ colors, variant, contrastLevel }: ColorThemeOption) {
    this.colorsPalette = colors.palette;
    this.variant = variant || Variant.TONAL_SPOT;
    this.contrastLevel = contrastLevel || 0;

    this.addDefaultDynamicColorsOptions();
    if (colors.dynamic) {
      const entries = Object.entries(colors.dynamic) as [
        DynamicColorKey,
        DynamicColor
      ][];
      entries.forEach(([key, color]) => {
        this.updateColorsOptions(key, color);
      });
    }
    if (!this.colorsPalette.primary) {
      throw new Error('Primary color must be specified');
    }
  }

  updateTheme(theme: Theme): Theme {
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

    const [colorPalette, _] = this.getColorPalette();

    Object.assign(colorsList, colorPalette);

    theme.colors = colorsList;

    return theme;
  }

  getArgbFromColorPalette(colorPalette: PaletteColorKey) {
    const hex = this.colorsPalette[colorPalette];
    if (hex) return argbFromHex(hex);
  }
  getDynamicScheme(isDark: boolean) {
    const primaryArgb = this.getArgbFromColorPalette('primary')!;

    const defaultTheme = createDynamicScheme(this.variant, {
      sourceColorHct: Hct.fromInt(primaryArgb),
      isDark: isDark,
      contrastLevel: this.contrastLevel,
    });
    const args = {
      sourceColorArgb: primaryArgb!,
      variant: this.variant,
      contrastLevel: this.contrastLevel,
      isDark: isDark,
      primaryPalette: defaultTheme.primaryPalette,
      secondaryPalette: defaultTheme.secondaryPalette,
      tertiaryPalette: defaultTheme.tertiaryPalette,
      neutralPalette: defaultTheme.neutralPalette,
      neutralVariantPalette: defaultTheme.neutralVariantPalette,
    };

    Object.keys(this.colorsPalette).forEach((colorPaletteKey) => {
      const colorPaletteArgb = this.getArgbFromColorPalette(
        colorPaletteKey as PaletteColorKey
      );
      if (colorPaletteArgb && colorPaletteKey !== 'primary') {
        const colorTheme = createDynamicScheme(this.variant, {
          sourceColorHct: Hct.fromInt(colorPaletteArgb),
          isDark: isDark,
          contrastLevel: this.contrastLevel,
        });

        // if (colorKey !== 'neutral' && colorKey !== 'neutralVariant') {
        //   (args as { [key: string]: any })[colorKey + 'Palette'] =
        //     colorTheme['primaryPalette'];
        // } else {
        (args as { [key: string]: any })[colorPaletteKey + 'Palette'] = (
          colorTheme as { [key: string]: any }
        )[colorPaletteKey + 'Palette'];
        // }
      }
    });

    return new DynamicScheme(args);
  }

  addDefaultDynamicColorsOptions() {
    let dynamicColors = MaterialDynamicColors.getColors();
    const entries = Object.entries(dynamicColors) as [
      DynamicColorKey,
      DynamicColor
    ][];
    entries.map(([key, dynamicColor]) =>
      this.colors.set(key, new Color({ ...dynamicColor }))
    );
  }

  updateColorsOptions(
    colorKey: DynamicColorKey,
    option: Partial<ColorOptions>
  ) {
    const color = this.colors.get(colorKey);
    if (color) {
      color.update(option);
      this.colors.set(colorKey, color);
    } else {
      new Error("The color doesn't exist.");
    }
  }
  exportTheme(): Partial<ThemeFigma> {
    let themeFigma: Partial<ThemeFigma> = {};

    const darkMode = ['light', 'dark'];
    darkMode.forEach((theme) => {
      const scheme = this.getDynamicScheme(theme === 'dark');
      for (const color of this.colors.values()) {
        const hex = color.getHex(scheme);

        themeFigma.schemes = {
          [darkMode ? 'dark' : 'light']: {
            [color.getName().replace(/(_\w)/g, function (match) {
              return match[1].toUpperCase();
            })]: hex,
          },
        };
      }
    });

    const [_, themeFigmaPalettes] = this.getColorPalette();
    themeFigma = { ...themeFigma, ...themeFigmaPalettes };

    return themeFigma;
  }
  getDynamicColors(scheme: DynamicScheme, darkMode: boolean) {
    let dynamicColors: Record<string, string> = {};
    for (const color of this.colors.values()) {
      const hex = color.getHex(scheme);
      const kebabCase = color.getName().replace(/_/g, '-').toLowerCase();
      dynamicColors[`${kebabCase}-${darkMode ? 'dark' : 'light'}`] = hex;
    }
    return dynamicColors;
  }

  getColorPalette() {
    let colorPalette: Record<string, string> = {};
    const dynamicScheme = this.getDynamicScheme(false);
    let themeFigma: Partial<ThemeFigma> = {};

    Object.entries({
      primary: dynamicScheme.primaryPalette,
      secondary: dynamicScheme.secondaryPalette,
      tertiary: dynamicScheme.tertiaryPalette,
      neutral: dynamicScheme.neutralPalette,
      'neutral-variant': dynamicScheme.neutralVariantPalette,
    }).forEach(([paletteName, tonalPalette]) => {
      (tonalPalette = dynamicScheme.primaryPalette),
        [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100].forEach(
          (value) => {
            const hex = hexFromArgb(tonalPalette.tone(value)).toUpperCase();

            colorPalette[`${paletteName}-${value}`] = hex;

            themeFigma.palettes = {
              [paletteName]: {
                [value]: hex,
              },
            };
          }
        );
    });
    return [colorPalette, themeFigma];
  }
}

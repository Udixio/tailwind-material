import {
  argbFromHex,
  DynamicColor,
  DynamicScheme,
  Hct,
  hexFromArgb,
} from '@material/material-color-utilities';
import { createDynamicScheme, Variant } from './variant';
import { DynamicColorOptions } from './colorTypes';
import {
  DynamicColorKey,
  MaterialDynamicColors,
} from './materialDynamicColors';
import { ExtendTheme } from '../utils/extendTheme';
import { Theme } from '..';

export type PaletteKeyColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'neutral'
  | 'neutralVariant';

export interface ColorThemeOption {
  colors: {
    palette: Record<PaletteKeyColor, string>;
    dynamic?: Record<DynamicColorKey, Partial<DynamicColorOptions>>;
  };
  variant?: Variant;
  contrastLevel?: number;
}

export class ColorTheme implements ExtendTheme {
  colorsPalette: Record<PaletteKeyColor, string>;
  argbColors: Record<PaletteKeyColor, number | undefined>;
  _dynamicColorsOptions = new Map<string, DynamicColorOptions>();
  variant: Variant;
  contrastLevel: number;

  constructor({ colors, variant, contrastLevel }: ColorThemeOption) {
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
    this.addDefaultDynamicColorsOptions();
    if (colors.dynamic) {
      Object.entries(colors.dynamic).forEach(([key, color]) => {
        const snakeCase = key.replace(
          /[A-Z]/g,
          (letter) => `_${letter.toLowerCase()}`
        );
        this.updateDynamicColorsOptions({
          ...color,
          name: snakeCase,
        });
      });
    }
    if (!this.colorsPalette.primary) {
      throw new Error('Primary color must be specified');
    }
  }

  updateTheme(theme: Theme): Theme {
    for (const colorKey in this.colorsPalette) {
      this.argbColors[colorKey] = this.colorsPalette[
        colorKey as PaletteKeyColor
      ]
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

    const colorPalette = this.getColorPalette();
    //TODO to be activated only when darkMode is tested

    // Object.assign(colorsList,colorPalette);

    theme.colors = colorsList;

    return theme;
  }

  getDynamicScheme(isDark: boolean) {
    const defaultTheme = createDynamicScheme(this.variant, {
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
        const colorTheme = createDynamicScheme(this.variant, {
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

  addDefaultDynamicColorsOptions() {
    let dynamicColors = MaterialDynamicColors.getColors();
    for (let key in dynamicColors) {
      if (Object.prototype.hasOwnProperty.call(dynamicColors, key)) {
        const dynamicColor = dynamicColors[key as DynamicColorKey];
        this.addDynamicColorsOptions({
          ...dynamicColor,
        });
      }
    }
  }

  addDynamicColorsOptions(args: DynamicColorOptions) {
    this._dynamicColorsOptions.set(args.name, args);
  }

  updateDynamicColorsOptions(
    args: { name: string } & Partial<DynamicColorOptions>
  ) {
    const dynamicColorsOptions = this._dynamicColorsOptions.get(args.name);
    if (dynamicColorsOptions) {
      this._dynamicColorsOptions.set(args.name, {
        ...dynamicColorsOptions,
        ...args,
      });
    } else {
      new Error("The color doesn't exist.");
    }
  }

  getDynamicColors(scheme: DynamicScheme, darkMode: boolean) {
    let dynamicColors: Record<string, string> = {};

    for (const dynamicColorOption of this._dynamicColorsOptions.values()) {
      const dynamicColor = DynamicColor.fromPalette(dynamicColorOption as any);

      const argb = dynamicColor!.getArgb(scheme);
      const hex = hexFromArgb(argb).toUpperCase();

      const kebabCase = dynamicColorOption.name
        .replace(/_/g, '-')
        .toLowerCase();

      dynamicColors[`${kebabCase}-${darkMode ? 'dark' : 'light'}`] = hex;

      ExportTheme.update({
        schemes: {
          [darkMode ? 'dark' : 'light']: {
            [dynamicColorOption.name.replace(/(_\w)/g, function (match) {
              return match[1].toUpperCase();
            })]: hex,
          },
        },
      });
    }

    return dynamicColors;
  }

  getColorPalette() {
    let colorPalette: Record<string, string> = {};
    const dynamicScheme = this.getDynamicScheme(false);

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

            ExportTheme.update({
              palettes: {
                [paletteName]: {
                  [value]: hex,
                },
              },
            });
          }
        );
    });
    return colorPalette;
  }
}
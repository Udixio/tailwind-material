import { MaterialTheme, MaterialThemeParams } from './colors/materialTheme';
import { darkTheme, DarkThemeParams } from './dark-theme';
import { materialStates } from './material-states';
import {
  FontFamily,
  MaterialFonts,
  MaterialFontsParams,
} from './material-fonts';
import { Config } from 'tailwindcss';
import { ExportTheme, ExportThemeParams } from './figma/exportTheme';

export interface createMaterialThemeParams
  extends MaterialThemeParams,
    Omit<DarkThemeParams, 'colors'>,
    MaterialFontsParams,
    ExportThemeParams {
  name?: string;
}

export const createMaterialTheme = (args: createMaterialThemeParams) => {
  const builder = new ThemeBuilder(args);
  return builder.build();
};

class ThemeBuilder {
  private colors: Record<string, string> = {};
  private plugins: { handler: any; config?: Partial<Config> | undefined }[] =
    [];

  private fontFamily?: { expressive?: string[]; body?: string[] };
  constructor(private args: createMaterialThemeParams) {}

  build() {
    this.createColors();
    this.addPlugin(materialStates().plugin);

    if (this.args.darkMode) {
      this.addDarkMode();
    }

    this.addFontsPlugin();

    ExportTheme.export({
      filePath: this.args.themePath,
      sourceColor: this.args.colors.palette.primary,
      name: this.args.name,
    });

    return {
      colors: this.colors,
      fontFamily: this.fontFamily,
      plugins: this.plugins,
    };
  }

  private createColors() {
    this.colors = new MaterialTheme({
      colors: this.args.colors,
      variant: this.args.variant,
      contrastLevel: this.args.contrastLevel,
    }).generateTheme();
  }

  private addDarkMode() {
    const theme = darkTheme({
      colors: this.colors,
      darkMode: this.args.darkMode,
    });
    this.colors = theme.colors;
    this.addPlugin(theme.plugin);
  }

  private addFontsPlugin() {
    const materialFonts = new MaterialFonts({
      fontFamily: this.args.fontFamily,
      fontStyles: this.args.fontStyles,
      responsiveBreakPoints: this.args.responsiveBreakPoints,
    });

    const result = materialFonts.generateFonts();
    this.fontFamily = result.fontFamily;
    this.addPlugin(result.plugin);

    for (let [key, value] of Object.entries(materialFonts.fontStyles)) {
      let name = key.split(/(?=[A-Z])/);

      const getFontWeight = (fontWeight: number) => {
        switch (fontWeight) {
          case 100:
            return 'Thin';
          case 200:
            return 'ExtraLight';
          case 300:
            return 'Light';
          case 400:
            return 'Regular';
          case 500:
            return 'Medium';
          case 600:
            return 'SemiBold';
          case 700:
            return 'Bold';
          case 800:
            return 'ExtraBold';
          case 900:
            return 'Black';
          default:
            return 'Regular';
        }
      };
      ExportTheme.update({
        styles: {
          [name[0]]: {
            [name[1].toLowerCase()]: {
              fontFamilyName:
                value.fontFamily == FontFamily.Expressive
                  ? materialFonts.fontFamily.expressive[0]
                  : materialFonts.fontFamily.neutral[0],
              fontFamilyStyle: getFontWeight(value.fontWeight),
              fontWeight: value.fontWeight,
              fontSize: value.fontSize * 16,
              lineHeight: value.lineHeight * 16,
              letterSpacing: (value.letterSpacing ?? 0) * 16,
            },
          },
        },
      });
    }
  }

  private addPlugin(plugin: {
    handler: any;
    config?: Partial<Config> | undefined;
  }) {
    this.plugins.push(plugin);
  }
}

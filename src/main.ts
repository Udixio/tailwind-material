import { MaterialTheme, MaterialThemeParams } from './colors/materialTheme';
import { darkTheme, DarkThemeParams } from './dark-theme';
import { materialStates } from './material-states';
import { materialFonts, MaterialFontsParams } from './material-fonts';
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
      fontFamily: this.args.fontFamily,
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
    const fonts = materialFonts({ fontFamily: this.args.fontFamily });
    this.addPlugin(fonts.plugin);
  }

  private addPlugin(plugin: {
    handler: any;
    config?: Partial<Config> | undefined;
  }) {
    this.plugins.push(plugin);
  }
}

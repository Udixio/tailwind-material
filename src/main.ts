import { ColorTheme, ColorThemeOption } from './colors/colorTheme';
import { darkTheme, DarkThemeParams } from './dark-mode/dark-theme';
import { FontTheme, FontThemeOption } from './font/font-theme';
import { Config } from 'tailwindcss';
import {
  ExportableTheme,
  ExportTheme,
  ExportThemeParams,
} from './figma/exportTheme';
import { ExtendTheme } from './utils/extendTheme';
import { PluginCreator } from 'tailwindcss/types/config';

export const createMaterialTheme = (args: createMaterialThemeParams) => {
  const builder = new ThemeBuilder(args);
  return builder.build();
};

export interface ModuleConstructor {
  new (args: ThemeBuilderOption): ExtendTheme | ExportableTheme;
}

export interface Theme {
  colors: Record<string, string>;
  fontFamily: { expressive: string[]; neutral: string[] };
  plugins: { handler: PluginCreator; config?: Partial<Config> | undefined }[];
}

export interface ThemeBuilderOption
  extends ColorThemeOption,
    Omit<DarkThemeParams, 'colors'>,
    FontThemeOption,
    ExportThemeParams {
  name?: string;
}

class ThemeBuilder {
  private modules: ModuleConstructor[] = [FontTheme, ColorTheme];
  private moduleInstances: (ExtendTheme | ExportableTheme)[] = [];
  private theme: Theme = {
    colors: {},
    fontFamily: { expressive: [], neutral: [] },
    plugins: [],
  };

  // private colors: Record<string, string> = {};
  // private plugins: { handler: any; config?: Partial<Config> | undefined }[] =
  //   [];
  // private fontFamily?: { expressive?: string[]; body?: string[] };

  constructor(private args: ThemeBuilderOption) {
    this.createInstances();
    this.build();
  }

  createInstances() {
    this.moduleInstances = this.modules.map((Module) => new Module(this.args));
  }

  build() {
    this.moduleInstances.forEach((module) => {
      if ('updateTheme' in module) {
        this.theme = module.updateTheme(this.theme);
      }
      if ('exportTheme' in module) {
        ExportTheme.update(module.exportTheme());
      }
      ExportTheme.export({
        filePath: this.args.themePath,
        sourceColor: this.args.colors.palette.primary,
        name: this.args.name,
      });
    });
    return this.theme;
  }

  private createColors() {
    this.colors = new ColorTheme({
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
    const result = materialFonts.generateFonts();
    this.fontFamily = result.fontFamily;
    this.addPlugin(result.plugin);
  }
}

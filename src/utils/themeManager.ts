import { FontTheme, FontThemeOption } from '../font/font-theme';
import { ColorTheme, ColorThemeOption } from '../colors';
import { ExtendTheme, Theme } from './extendTheme';
import { ExportableTheme, ExportTheme, ExportThemeParams } from '../figma';
import { DarkThemeParams } from '../dark-mode/dark-theme';

export interface ThemeBuilderOption
  extends ColorThemeOption,
    Omit<DarkThemeParams, 'colors'>,
    FontThemeOption,
    ExportThemeParams {
  name?: string;
}
interface ModuleConstructor {
  new (args: ThemeBuilderOption): ExtendTheme | ExportableTheme;
}
export class ThemeManager {
  private moduleInstances: (ExtendTheme | ExportableTheme)[] = [];
  private theme: Theme = {
    colors: {},
    fontFamily: { expressive: [], neutral: [] },
    plugins: [],
  };

  constructor(
    private args: ThemeBuilderOption,
    private modules: ModuleConstructor[] = [FontTheme, ColorTheme]
  ) {
    this.createInstances();
  }

  build() {
    this.updateTheme();
    this.exportTheme();
    return this.theme;
  }

  private updateTheme() {
    this.moduleInstances.forEach((module) => {
      if ('updateTheme' in module) {
        this.theme = module.updateTheme(this.theme);
      }
    });
  }
  private exportTheme() {
    this.moduleInstances.forEach((module) => {
      if ('exportTheme' in module) {
        ExportTheme.update(module.exportTheme());
      }
    });
    ExportTheme.export({
      filePath: this.args.themePath,
      sourceColor: this.args.colors.palette.primary,
      name: this.args.name,
    });
  }

  private createInstances() {
    this.moduleInstances = this.modules.map((Module) => new Module(this.args));
  }

  // private colors: Record<string, string> = {};
  // private plugins: { handler: any; config?: Partial<Config> | undefined }[] =
  //   [];
  // private fontFamily?: { expressive?: string[]; body?: string[] };

  // private createColors() {
  //     this.colors = new ColorTheme({
  //         variant: this.args.variant,
  //         contrastLevel: this.args.contrastLevel,
  //     }).generateTheme();
  // }
  //
  // private addDarkMode() {
  //     const theme = darkTheme({
  //         colors: this.colors,
  //         darkMode: this.args.darkMode,
  //     });
  //     this.colors = theme.colors;
  //     this.addPlugin(theme.plugin);
  // }
  //
  // private addFontsPlugin() {
  //     const result = materialFonts.generateFonts();
  //     this.fontFamily = result.fontFamily;
  //     this.addPlugin(result.plugin);
  // }
}

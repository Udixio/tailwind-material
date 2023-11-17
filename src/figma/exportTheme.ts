import fs from 'fs';

export interface ExportThemeParams {
  themePath?: string;
}

interface Font {
  fontFamilyName: string;
  fontFamilyStyle: string;
  fontWeight: number;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
}

interface Styles {
  large: Font;
  medium: Font;
  small: Font;
}

interface ExtendedColors {
  harmonized: boolean;
  color: string;
  name: string;
  description: string;
}

interface Colors {
  [key: string]: string;
}

interface Theme {
  seed: string;
  description: string;
  coreColors: Colors;
  schemes: Record<string, Colors>;
  palettes: Record<string, Colors>;
  styles: Record<string, Styles>;
  extendedColors: ExtendedColors[];
  name: string;
}

export class ExportTheme {
  private static _theme: any = {};

  public static get theme() {
    return this._theme;
  }

  public static add(args: Partial<Theme>) {
    this._theme = {
      ...this.theme,
      ...args,
    };
  }

  static export(args: {
    filePath?: string;
    sourceColor: string;
    name?: string;
  }) {
    if (args.filePath) {
      this.add({ description: 'TYPE: CUSTOM' });
      ExportTheme.add({
        coreColors: {
          primary: args.sourceColor,
        },
      });
      ExportTheme.add({
        name: args.name ?? 'udixio-tailwind-material',
      });

      const themeJSON = JSON.stringify(this.theme, null, 2);
      fs.writeFileSync(args.filePath, themeJSON);
    }
  }

  public static deepUpdate(data: any, updateObject: any): any {
    if (
      updateObject &&
      typeof updateObject === 'object' &&
      Object.keys(updateObject).length > 0
    ) {
      for (const key in updateObject) {
        if (updateObject.hasOwnProperty(key)) {
          if (
            typeof updateObject[key] === 'object' &&
            !Array.isArray(updateObject[key])
          ) {
            if (!data[key]) {
              data[key] = {};
            }
            this.deepUpdate(data[key], updateObject[key]);
          } else {
            data[key] = updateObject[key];
          }
        }
      }
    }
    return data;
  }

  public static update(updateObject: Partial<Theme>): void {
    this._theme = this.deepUpdate({ ...this._theme }, updateObject);
  }
}

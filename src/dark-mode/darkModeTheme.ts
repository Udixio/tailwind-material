import plugin from 'tailwindcss/plugin';
import { ExtendTheme, Theme } from '../utils';
import Color from 'color';
import { flattenColors } from '../utils/flattenColors';

export interface DarkModeThemeOption {
  darkMode?: 'class' | 'media';
}

export class DarkModeTheme implements ExtendTheme {
  constructor(private args: DarkModeThemeOption = { darkMode: 'class' }) {}

  updateTheme(theme: Theme): Theme {
    const stylesToAdd: { [key: string]: { [key: string]: any } } = {
      html: {},
      ...(this.args.darkMode === 'media'
        ? { '@media (prefers-color-scheme: dark)': { html: {} } }
        : { '.dark': {} }),
    };

    let colors = flattenColors(theme.colors);
    Object.keys(colors).forEach((colorName) => {
      const match = colorName.match(
        new RegExp(`^(?:(.+)-)?${'light'}(?:-(.+))?$`)
      );

      if (!match) return;

      const [_, prefix, suffix] = match;
      const modeAwareColorName = [prefix, suffix].filter((x) => x).join('-');
      const lightColor = colors[colorName];
      const darkColor =
        colors[[prefix, 'dark', suffix].filter((x) => x).join('-')];

      if (lightColor && darkColor) {
        if (colors[modeAwareColorName]) {
          throw new Error(
            `withModeAwareColors plugin error: adding the color '${modeAwareColorName}' that is mode-aware would overwrite a color that’s currently in existence.`
          );
        } else {
          colors[modeAwareColorName] = this.formatRgb(lightColor);
          this.handleStylesToAdd(
            darkColor,
            modeAwareColorName,
            colors[modeAwareColorName],
            stylesToAdd,
            colors
          );
        }
      }
    });

    theme.plugins.push(
      plugin(({ addBase, theme }) => {
        addBase(stylesToAdd);
      })
    );
    theme.colors = colors;

    return theme;
  }

  private formatRgb(color: any) {
    return Color(color).rgb().array().join(' ');
  }

  private handleStylesToAdd(
    darkColor: any,
    modeAwareColorName: string,
    lightStyle: string,
    stylesToAdd: any,
    colors: Record<string, string>
  ) {
    const varName = `--color-${modeAwareColorName}`;
    colors[modeAwareColorName] = `rgb(var(${varName}) / <alpha-value> )`;

    if (!darkColor) return;

    const darkStyle = this.formatRgb(darkColor);
    // colors[modeAwareColorName] = colorFormat;
    stylesToAdd.html[varName] = lightStyle;
    if (darkColor === 'media') {
      stylesToAdd['@media (prefers-color-scheme: dark)'].html[varName] =
        darkStyle;
    } else {
      stylesToAdd['.dark'][varName] = darkStyle;
    }
  }
}

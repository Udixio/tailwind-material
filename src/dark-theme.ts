import plugin from 'tailwindcss/plugin';
import Color from 'color';

export interface DarkThemeParams {
  colors: Record<string, string>;
  darkMode: 'class' | 'media';
}

export function darkTheme({ colors, darkMode }: DarkThemeParams) {
  const stylesToAdd: { [key: string]: { [key: string]: any } } = {
    html: {},
    ...(darkMode === 'media'
      ? { '@media (prefers-color-scheme: dark)': { html: {} } }
      : { '.dark': {} }),
  };

  Object.keys(colors).forEach((colorName) => {
    const match = colorName.match(
      new RegExp(`^(?:(.+)-)?${'light'}(?:-(.+))?$`)
    );

    if (match) {
      const prefix = match[1];
      const suffix = match[2];
      const modeAwareColorName = [prefix, suffix].filter((x) => x).join('-');

      const lightColor = colors[colorName];
      const darkColor =
        colors[[prefix, 'dark', suffix].filter((x) => x).join('-')];

      if (lightColor && darkColor) {
        if (colors[modeAwareColorName]) {
          throw new Error(
            `withModeAwareColors plugin error: adding the '${modeAwareColorName}' mode-aware color would overwrite an existing color.`
          );
        } else {
          const varName = `--color-${modeAwareColorName}`;
          colors[modeAwareColorName] = `rgb(var(${varName}) / <alpha-value> )`;
          const lightStyle = Color(lightColor).rgb().array().join(' ');
          const darkStyle = Color(darkColor).rgb().array().join(' ');

          stylesToAdd.html[varName] = lightStyle;
          if (darkColor === 'media') {
            stylesToAdd['@media (prefers-color-scheme: dark)'].html[varName] =
              darkStyle;
          } else {
            stylesToAdd['.dark'][varName] = darkStyle;
          }
        }
      }
    }
  });

  return {
    colors: colors,
    plugin: plugin(({ addBase }) => addBase(stylesToAdd)),
  };
}

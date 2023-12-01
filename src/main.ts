import { Theme, ThemeBuilderOption, ThemeManager } from './utils';
import { Config } from 'tailwindcss';

export const createTheme = (args: ThemeBuilderOption): Theme => {
  const themeManager = new ThemeManager(args);
  return themeManager.build();
};

export const createConfig = (
  config: Config,
  themeOption: ThemeBuilderOption
): Config => {
  const theme = createTheme(themeOption);

  const plugins = config.plugins
    ? [config.plugins?.values, ...theme.plugins]
    : theme.plugins;
  return {
    ...config,
    theme: {
      ...config.theme,
      fontFamily: { ...config.fontFamily, ...theme.fontFamily },
      extend: {
        ...config.theme?.extend,
        colors: {
          ...config.theme?.extend?.colors,
          ...theme.colors,
        },
        boxShadow: {
          '1': '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
          '2': '0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
          '3': '0px 1px 3px 0px rgba(0, 0, 0, 0.30), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)',
          '4': '0px 2px 3px 0px rgba(0, 0, 0, 0.30), 0px 6px 10px 4px rgba(0, 0, 0, 0.15)',
          '5': '0px 4px 4px 0px rgba(0, 0, 0, 0.30), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    plugins: plugins,
  };
};

import { Theme, ThemeBuilderOption, ThemeManager } from './utils';

export const createMaterialTheme = (args: ThemeBuilderOption): Theme => {
  const themeManager = new ThemeManager(args);
  return themeManager.build();
};

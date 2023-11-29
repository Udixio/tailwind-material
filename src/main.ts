import { ThemeBuilderOption, ThemeManager } from './utils';

export const createMaterialTheme = (args: ThemeBuilderOption) => {
  const themeManager = new ThemeManager(args);
  return themeManager.build();
};

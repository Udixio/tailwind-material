import { ThemeBuilderOption, ThemeManager } from './utils/themeManager';

export const createMaterialTheme = (args: ThemeBuilderOption) => {
  const themeManager = new ThemeManager(args);
  return themeManager.build();
};

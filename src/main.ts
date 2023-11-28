import { ThemeBuilderOption, ThemeManager } from './utils/themeManager';

export const createMaterialTheme = (args: ThemeBuilderOption) => {
  const builder = new ThemeManager(args);
  return builder.build();
};

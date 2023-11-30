import { DarkModeTheme } from '../../src';
import { colorsStub, darkModeOptionStub } from './darkMode.stub';

describe('fontTheme', () => {
  let darkModeTheme: DarkModeTheme;
  beforeEach(() => {
    darkModeTheme = new DarkModeTheme(darkModeOptionStub);
  });

  it('should properly initialize with provided theme option', () => {
    expect(darkModeTheme).toBeTruthy();
  });

  it('should throw error for duplicate mode-aware color', () => {
    const theme: any = {
      colors: colorsStub,
      plugins: [],
    };

    expect(() => darkModeTheme.updateTheme(theme)).toThrow(
      `withModeAwareColors plugin error: adding the 'blue' mode-aware color would overwrite an existing color.`
    );
  });

  it('should update theme appropriately', () => {
    const theme: any = {
      colors: colorsStub,
      plugins: [],
    };

    const updatedTheme = darkModeTheme.updateTheme(theme);

    expect(updatedTheme).toHaveProperty('colors.blue');
    expect(updatedTheme.colors.blue).toEqual(
      'rgb(var(--color-blue) / <alpha-value> )'
    );
    expect(updatedTheme).toHaveProperty('plugins');
    expect(updatedTheme.plugins.length).toEqual(1);
  });
});

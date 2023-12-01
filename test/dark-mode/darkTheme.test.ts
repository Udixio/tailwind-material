import { DarkModeTheme } from '../../src';
import { colorsStub, darkModeOptionStub } from './darkMode.stub';

describe('darkTheme', () => {
  let darkModeTheme: DarkModeTheme;
  beforeEach(() => {
    darkModeTheme = new DarkModeTheme(darkModeOptionStub);
  });

  it('should be created', () => {
    expect(darkModeTheme).toBeDefined();
  });

  it('should update theme', () => {
    const theme: any = {
      colors: colorsStub,
      plugins: [],
    };
    const updatedTheme = darkModeTheme.updateTheme(theme);

    expect(updatedTheme).toBeDefined();
    expect(updatedTheme.plugins).toHaveLength(1);
  });

  it('should format rgb', () => {
    const color = '#ffffff';
    const formattedRgb = darkModeTheme['formatRgb'](color);

    expect(formattedRgb).toBe('255 255 255');
  });

  it('should handle styles to add', () => {
    const darkColor = '#00008b';
    const modeAwareColorName = 'colorName';
    const lightStyle = '255 255 255';
    const stylesToAdd: { [key: string]: { [key: string]: any } } = {
      html: {},
      ...(darkModeOptionStub.darkMode === 'media'
        ? { '@media (prefers-color-scheme: dark)': { html: {} } }
        : { '.dark': {} }),
    };
    const colors = {};

    darkModeTheme['handleStylesToAdd'](
      darkColor,
      modeAwareColorName,
      lightStyle,
      stylesToAdd,
      colors
    );

    expect(colors[modeAwareColorName]).toBeDefined();
    expect(stylesToAdd.html[`--color-${modeAwareColorName}`]).toBeDefined();
  });
});

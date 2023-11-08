import {Config} from 'tailwindcss';
import {createMaterialTheme} from '../src';
//TODO complete the test
describe('createMaterialTheme', () => {
  let theme: {
    colors: Record<string, string>;
    fontFamily: { roboto: string[] };
    plugins: { handler: any; config?: Partial<Config> }[];
  };
  beforeEach(() => {
    theme = createMaterialTheme({
      colors: {
        palette: {
          primary: '#6750A4',
        },
      },
      darkMode: 'class',
    });
  });

  it('Each color should have a light and dark mode version', () => {
    const { colors } = theme;
    const ignoredColors = ['transparent', 'current', 'black', 'white'];

    for (const colorKey in colors) {
      if (ignoredColors.includes(colorKey)) continue;
      const isLightColor = colorKey.includes('-light');
      const isDarkColor = colorKey.includes('-dark');
      if (!isLightColor && !isDarkColor) continue;

      const counterpartKey = isLightColor
        ? colorKey.replace('-light', '-dark')
        : colorKey.replace('-dark', '-light');
      if (!colors.hasOwnProperty(counterpartKey)) {
        throw new Error(`Missing counterpart for color: ${colorKey}`);
      }
    }
  });

  it('should generate secondary and tertiary light colors different from primary light color', () => {
    const { colors } = theme;
    const {
      'primary-light': primaryLight,
      'secondary-light': secondaryLight,
      'tertiary-light': tertiaryLight,
    } = colors;

    expect(primaryLight).toBeDefined();
    expect(secondaryLight).toBeDefined();
    expect(tertiaryLight).toBeDefined();

    expect(primaryLight).toBe('#65558f');
    expect(secondaryLight).toBe('#625b71');
    expect(tertiaryLight).toBe('#7e5260');

    expect(secondaryLight).not.toEqual(primaryLight);
    expect(tertiaryLight).not.toEqual(primaryLight);
  });

  it('doit rendre une surface blanc lorsque la tonalité est réglé à 100', () => {
    const toneFunction = jest.fn((s) => (s.isDark ? 6 : 100));
    theme = createMaterialTheme({
      colors: {
        palette: {
          primary: '#6750A4',
        },
        dynamic: {
          surface: {
            tone: toneFunction,
          },
        },
      },
      darkMode: 'class',
    });
    expect(toneFunction).toHaveBeenCalled();
    expect(theme.colors['surface-light']).toEqual('#ffffff');
  });
  it('doit rendre une primary égal à la couleur source lorsque ...', () => {
    theme = createMaterialTheme({
      colors: {
        palette: {
          primary: '#6750A4',
        },
        dynamic: {
          primary: {
            tone: (s) => {
              return 100;
            },
            toneDeltaPair: undefined,
          },
          // onPrimary: {
          //   tone: (s) => {
          //     return DynamicColor.foregroundTone(
          //       MaterialDynamicColors.primaryContainer.tone(s),
          //       4.5
          //     );
          //   },
          // },
        },
      },
      darkMode: 'class',
    });
    expect(theme.colors['primary-light']).toEqual('#ffffff');
    // expect(theme.colors['on-primary-light']).toEqual('#6750A4');
  });
});

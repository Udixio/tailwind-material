import { Config } from 'tailwindcss';
import {
  ContrastCurve,
  createMaterialTheme,
  MaterialDynamicColors,
} from '../src';
import { DynamicColor } from '@material/material-color-utilities';

//TODO complete the test
describe('createMaterialTheme', () => {
  let theme: {
    colors: Record<string, string>;
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

    expect(primaryLight).toBe('#65558F');
    expect(secondaryLight).toBe('#625B71');
    expect(tertiaryLight).toBe('#7E5260');

    expect(secondaryLight).not.toEqual(primaryLight);
    expect(tertiaryLight).not.toEqual(primaryLight);
  });

  it('Should render a white surface when the tone is set to 100', () => {
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
    expect(theme.colors['surface-light']).toEqual('#FFFFFF');
  });
  it('Should the primary key be equal to the source when configuring the tones as the fidelity variant.', () => {
    theme = createMaterialTheme({
      colors: {
        palette: {
          primary: '#87CEEB',
        },
        dynamic: {
          primary: {
            tone: (s) => {
              return s.sourceColorHct.tone;
            },
            background: (s) => MaterialDynamicColors.highestSurface(s),
            contrastCurve: new ContrastCurve(1, 1, 3, 7),
            toneDeltaPair: undefined,
          },
          onPrimary: {
            tone: (s) => {
              return DynamicColor.foregroundTone(
                MaterialDynamicColors.getColor('primaryContainer').tone(s),
                4.5
              );
            },
          },
        },
      },
      darkMode: 'class',
    });
    expect(theme.colors['primary-light']).toEqual('#87CEEB');
    // expect(colors.colors['on-primary-light']).toEqual('#6750A4');
  });

  it('Doit créer un fichier de colors pour figma', () => {
    theme = createMaterialTheme({
      colors: {
        palette: {
          primary: '#6750A4',
        },
      },
      darkMode: 'class',
      themePath: './colors.json',
      name: "it's a test",
    });
    // expect(colors.colors['primary-light']).toEqual('#87ceeb');
    // expect(colors.colors['on-primary-light']).toEqual('#6750A4');
  });
});

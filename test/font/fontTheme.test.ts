import { FontRole, FontSize, FontStyle, FontTheme } from '../../src';
import { fontOptionStub } from './fontOption.stub';

describe('fontTheme', () => {
  let fontTheme: FontTheme;
  beforeEach(() => {
    fontTheme = new FontTheme(fontOptionStub());
  });

  it('should instantiate with default parameters', () => {
    const theme = new FontTheme();
    expect(theme).toBeInstanceOf(FontTheme);
  });

  it('should instantiate with passed parameters and override defaults', () => {
    const fontThemeOption = {
      fontFamily: {
        expressive: ['Arial', 'sans-serif'],
        neutral: ['Verdana', 'sans-serif'],
      },
    };

    const theme = new FontTheme(fontThemeOption);
    expect(theme.fontFamily.expressive[0]).toBe('Arial');
    expect(theme.fontFamily.neutral[0]).toBe('Verdana');
  });

  describe('createUtilities', () => {
    it('should properly generate utility classes', () => {
      const mockTheme: any = (lookup: string) => {
        switch (lookup) {
          case 'screens.lg':
            return '640px';
          default:
            return 'mock-font-family';
        }
      };
      const utilities = fontTheme['createUtilities']({ theme: mockTheme });
      const roles: FontRole[] = [
        'display',
        'headline',
        'title',
        'label',
        'body',
      ];
      const sizes: FontSize[] = ['large', 'medium', 'small'];
      roles.forEach((role) => {
        sizes.forEach((size) => {
          const utilityClassName = `.text-${role}-${size}`;
          const fontStyle: FontStyle = fontTheme.fontStyles[role][size];
          const expectedValue = {
            fontSize: `${fontStyle.fontSize}rem`,
            fontWeight: fontStyle.fontWeight,
            lineHeight: `${fontStyle.lineHeight}rem`,
            letterSpacing: fontStyle.letterSpacing
              ? `${fontStyle.letterSpacing}rem`
              : null,
            fontFamily: 'mock-font-family',
            [`@media (min-width: ${mockTheme('screens.lg')})`]: {
              fontSize: `${fontStyle.fontSize * 1.125}rem`,
              lineHeight: `${fontStyle.lineHeight * 1.125}rem`,
            },
          };

          expect(utilities[utilityClassName]).toMatchObject(expectedValue);
        });
      });
    });
  });

  describe('getFontWeight', () => {
    it('should return FontWeights for input 100 to 900', () => {
      const FontWeights = [
        'Thin',
        'ExtraLight',
        'Light',
        'Regular',
        'Medium',
        'SemiBold',
        'Bold',
        'ExtraBold',
        'Black',
      ];
      let result = [];
      for (let i = 100; i <= 900; i += 100) {
        result.push(fontTheme['getFontWeight'](i));
      }
      expect(result).toEqual(FontWeights);
    });

    it('should return Regular for any input', () => {
      expect(fontTheme['getFontWeight'](150)).toBe('Regular');
    });
  });
});

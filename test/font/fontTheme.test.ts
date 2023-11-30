import { FontTheme } from '../../src';
import { fontOptionStub } from './fontOption.stub';

describe('fontTheme', () => {
  let theme: FontTheme;
  beforeEach(() => {
    theme = new FontTheme(fontOptionStub());
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
        result.push(theme['getFontWeight'](i));
      }
      expect(result).toEqual(FontWeights);
    });

    it('should return Regular for any input', () => {
      expect(theme['getFontWeight'](150)).toBe('Regular');
    });
  });
});

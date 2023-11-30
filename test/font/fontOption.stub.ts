import { FontThemeOption } from '../../src';

export const fontOptionStub = (): FontThemeOption => {
  return {
    fontFamily: {
      expressive: ['Montserrat', 'sans-serif'],
      neutral: ['Roboto', 'sans-serif'],
    },
  };
};

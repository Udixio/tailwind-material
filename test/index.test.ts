import { createMaterialTheme } from '../src';
//TODO complete the test
describe('createMaterialTheme', () => {
  it('returns an object with correct color and plugin configurations', () => {
    const result = createMaterialTheme(
      {
        primary: '#6750A4',
        secondary: '#958DA5',
        tertiary: '#B58392',
      },
      'class'
    );
    expect(result.colors.primary).toEqual(
      'rgb(var(--color-primary) / <alpha-value> )'
    );
    expect(result.colors.secondary).toEqual(
      'rgb(var(--color-secondary) / <alpha-value> )'
    );
    expect(result.colors.tertiary).toEqual(
      'rgb(var(--color-tertiary) / <alpha-value> )'
    );
    expect(result.plugins.length).toBeGreaterThan(0);
  });
});

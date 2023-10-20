import { createMaterialTheme } from '../src';
//TODO complete the test
describe('createMaterialTheme', () => {
  it('returns an object with correct color and plugin configurations', () => {
    const result = createMaterialTheme(
      {
        primary: '#0a65ec',
      },
      'class'
    );

    expect(result.colors['primary-container-light']).toEqual('#0a65ec');
    // expect(result.colors['primary-light']).toEqual('#513a8d');
    // expect(result.colors['primary-dark']).toEqual('#D0BCFF');
    expect(result.colors.primary).toEqual(
      'rgb(var(--color-primary) / <alpha-value> )'
    );
    // expect(result.colors['secondary-light']).toEqual('#625b71');
    // expect(result.colors['secondary-dark']).toEqual('#ccc2dc');
    expect(result.colors.secondary).toEqual(
      'rgb(var(--color-secondary) / <alpha-value> )'
    );
    // expect(result.colors['tertiary-light']).toEqual('#7d5260');
    // expect(result.colors['tertiary-dark']).toEqual('#efb8c8');
    expect(result.colors.tertiary).toEqual(
      'rgb(var(--color-tertiary) / <alpha-value> )'
    );
    expect(result.plugins.length).toBeGreaterThan(0);
  });
});

import {
  Hct,
  SchemeExpressive,
  SchemeFidelity,
  SchemeMonochrome,
  SchemeNeutral,
  SchemeTonalSpot,
  SchemeVibrant,
} from '@material/material-color-utilities';

export enum Variant {
  MONOCHROME,
  NEUTRAL,
  TONAL_SPOT,
  VIBRANT,
  EXPRESSIVE,
  FIDELITY,
  CONTENT,
  // RAINBOW,
  // FRUIT_SALAD,
}

export function createDynamicScheme(
  variant: Variant,
  schemeOptions: {
    sourceColorHct: Hct;
    isDark: boolean;
    contrastLevel: number;
  }
) {
  switch (variant) {
    case Variant.MONOCHROME:
      return new SchemeMonochrome(
        schemeOptions.sourceColorHct,
        schemeOptions.isDark,
        schemeOptions.contrastLevel
      );
    case Variant.NEUTRAL:
      return new SchemeNeutral(
        schemeOptions.sourceColorHct,
        schemeOptions.isDark,
        schemeOptions.contrastLevel
      );
    case Variant.TONAL_SPOT:
      return new SchemeTonalSpot(
        schemeOptions.sourceColorHct,
        schemeOptions.isDark,
        schemeOptions.contrastLevel
      );
    case Variant.VIBRANT:
      return new SchemeVibrant(
        schemeOptions.sourceColorHct,
        schemeOptions.isDark,
        schemeOptions.contrastLevel
      );
    case Variant.EXPRESSIVE:
      return new SchemeExpressive(
        schemeOptions.sourceColorHct,
        schemeOptions.isDark,
        schemeOptions.contrastLevel
      );
    case Variant.FIDELITY:
      return new SchemeFidelity(
        schemeOptions.sourceColorHct,
        schemeOptions.isDark,
        schemeOptions.contrastLevel
      );
    case Variant.CONTENT:
      return new SchemeFidelity(
        schemeOptions.sourceColorHct,
        schemeOptions.isDark,
        schemeOptions.contrastLevel
      );
    // case Variant.RAINBOW:
    //   return new SchemeRainbow(
    //     schemeOptions.sourceColorHct,
    //     schemeOptions.isDark,
    //     schemeOptions.contrastLevel
    //   );
    // case Variant.FRUIT_SALAD:
    //   return new SchemeFruitSalad(
    //     schemeOptions.sourceColorHct,
    //     schemeOptions.isDark,
    //     schemeOptions.contrastLevel
    //   );
    default:
      throw new Error('Unsupported scheme variant');
  }
}

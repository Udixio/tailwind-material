import plugin from 'tailwindcss/plugin';
import { CSSRuleObject } from 'tailwindcss/types/config';

type FontStyle = {
  fontSize: number;
  lineHeight: number;
  fontWeight: number;
  letterSpacing?: number;
  fontFamily: FontFamily;
};

export enum FontFamily {
  Expressive = 'expressive',
  Neutral = 'neutral',
}

export interface MaterialFontsParams {
  fontFamily?: { expressive?: string[]; neutral?: string[] };
  responsiveBreakPoints?: Record<string, number>;
  fontStyles?: Record<string, Partial<FontStyle>>;
}

export class MaterialFonts {
  pixelUnit = 'rem';
  fontFamily: { expressive: string[]; neutral: string[] };
  responsiveBreakPoints: Record<string, number>;
  fontStyles: Record<string, FontStyle>;

  constructor(args: MaterialFontsParams) {
    this.fontFamily = {
      expressive: args.fontFamily?.expressive ?? ['Roboto', 'sans-serif'],
      neutral: args.fontFamily?.neutral ?? ['Roboto', 'sans-serif'],
    };
    this.responsiveBreakPoints = args.responsiveBreakPoints ?? {
      lg: 1.125,
    };
    this.fontStyles = {
      displayLarge: {
        fontWeight: 400,
        fontSize: 3.5625,
        lineHeight: 4,
        letterSpacing: -0.015625,
        fontFamily: FontFamily.Expressive,
      },
      displayMedium: {
        fontWeight: 400,
        fontSize: 2.8125,
        lineHeight: 3.25,
        fontFamily: FontFamily.Expressive,
      },
      displaySmall: {
        fontWeight: 400,
        fontSize: 2.25,
        lineHeight: 2.75,
        fontFamily: FontFamily.Expressive,
      },
      headlineLarge: {
        fontWeight: 400,
        fontSize: 2,
        lineHeight: 2.5,
        fontFamily: FontFamily.Expressive,
      },
      headlineMedium: {
        fontWeight: 400,
        fontSize: 1.75,
        lineHeight: 2.25,
        fontFamily: FontFamily.Expressive,
      },
      headlineSmall: {
        fontWeight: 400,
        fontSize: 1.5,
        lineHeight: 2,
        fontFamily: FontFamily.Expressive,
      },
      titleLarge: {
        fontWeight: 400,
        fontSize: 1.375,
        lineHeight: 1.75,
        fontFamily: FontFamily.Neutral,
      },
      titleMedium: {
        fontWeight: 500,
        fontSize: 1,
        lineHeight: 1.5,
        fontFamily: FontFamily.Neutral,
        letterSpacing: 0.009375,
      },
      titleSmall: {
        fontWeight: 500,
        fontSize: 0.875,
        lineHeight: 1.25,
        fontFamily: FontFamily.Neutral,
        letterSpacing: 0.00625,
      },
      labelLarge: {
        fontWeight: 500,
        fontSize: 0.875,
        lineHeight: 1.25,
        fontFamily: FontFamily.Neutral,
        letterSpacing: 0.00625,
      },
      labelMedium: {
        fontWeight: 500,
        fontSize: 0.75,
        lineHeight: 1,
        fontFamily: FontFamily.Neutral,
        letterSpacing: 0.03125,
      },
      labelSmall: {
        fontWeight: 500,
        fontSize: 0.6875,
        lineHeight: 1,
        fontFamily: FontFamily.Neutral,
        letterSpacing: 0.03125,
      },
      bodyLarge: {
        fontWeight: 400,
        fontSize: 1,
        lineHeight: 1.5625,
        fontFamily: FontFamily.Neutral,
        letterSpacing: 0.03125,
      },
      bodyMedium: {
        fontWeight: 400,
        fontSize: 0.875,
        lineHeight: 1.25,
        fontFamily: FontFamily.Neutral,
        letterSpacing: 0.015625,
      },
      bodySmall: {
        fontWeight: 400,
        fontSize: 0.75,
        lineHeight: 1,
        fontFamily: FontFamily.Neutral,
        letterSpacing: 0.025,
      },
    };
    if (args.fontStyles)
      Object.entries(args.fontStyles).forEach(([key, value]) => {
        this.fontStyles[key] = {
          ...this.fontStyles[key],
          ...value,
        };
      });
  }

  generateFonts() {
    return {
      fontFamily: {
        expressive: this.fontFamily?.expressive,
        neutral: this.fontFamily?.neutral,
      },
      plugin: plugin(({ addUtilities, theme }) => {
        for (let [key, value] of Object.entries(this.fontStyles)) {
          key = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

          let newUtilies = {
            ['.text-' + key]: {
              fontSize: value.fontSize + this.pixelUnit,
              fontWeight: value.fontWeight as unknown as CSSRuleObject,
              lineHeight: value.lineHeight + this.pixelUnit,
              letterSpacing: value.letterSpacing
                ? value.letterSpacing + this.pixelUnit
                : undefined,
              fontFamily: theme('fontFamily.' + value.fontFamily),
              ...Object.entries(this.responsiveBreakPoints).reduce(
                (acc, [breakPointName, breakPointRatio]) => {
                  acc = {
                    ...acc,
                    [`@media (min-width: ${theme(
                      'screens.' + breakPointName,
                      {}
                    )})`]: {
                      fontSize:
                        value.fontSize * breakPointRatio + this.pixelUnit,
                      lineHeight:
                        value.lineHeight * breakPointRatio + this.pixelUnit,
                    },
                  } as any;
                  return acc;
                },
                {}
              ),
            },
          } as CSSRuleObject;

          addUtilities(newUtilies);
        }
      }),
    };
  }
}

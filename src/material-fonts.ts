import plugin from 'tailwindcss/plugin';
import { CSSRuleObject } from 'tailwindcss/types/config';

type TypographyStyle = {
  fontSize: number;
  lineHeight: number;
  letterSpacing?: number;
  fontFamily: string;
};

export interface MaterialFontsParams {
  fontFamily?: { expressive?: string; body?: string };
}

export const materialFonts = (args: MaterialFontsParams) => {
  return {
    fontFamily: {
      expressive: [args.fontFamily?.expressive ?? 'Roboto', 'sans-serif'],
      body: [args.fontFamily?.body ?? 'Roboto', 'sans-serif'],
    },
    plugin: plugin(({ addUtilities, theme }) => {
      const pixelUnit = 'rem';
      const typographyStyles: Record<string, TypographyStyle> = {
        displayLarge: {
          fontSize: 3.5625,
          lineHeight: 4,
          letterSpacing: -0.015625,
          fontFamily: theme('fontFamily.expressive'),
        },
        displayMedium: {
          fontSize: 2.8125,
          lineHeight: 3.25,
          fontFamily: theme('fontFamily.expressive'),
        },
        displaySmall: {
          fontSize: 2.25,
          lineHeight: 2.75,
          fontFamily: theme('fontFamily.expressive'),
        },
        headlineLarge: {
          fontSize: 2,
          lineHeight: 2.5,
          fontFamily: theme('fontFamily.expressive'),
        },
        headlineMedium: {
          fontSize: 1.75,
          lineHeight: 2.25,
          fontFamily: theme('fontFamily.expressive'),
        },
        headlineSmall: {
          fontSize: 1.5,
          lineHeight: 2,
          fontFamily: theme('fontFamily.expressive'),
        },
        titleLarge: {
          fontSize: 1.375,
          lineHeight: 1.75,
          fontFamily: theme('fontFamily.body'),
        },
        titleMedium: {
          fontSize: 1,
          lineHeight: 1.5,
          fontFamily: theme('fontFamily.body'),
          letterSpacing: 0.009375,
        },
        titleSmall: {
          fontSize: 0.875,
          lineHeight: 1.25,
          fontFamily: theme('fontFamily.body'),
          letterSpacing: 0.00625,
        },
        labelLarge: {
          fontSize: 0.875,
          lineHeight: 1.25,
          fontFamily: theme('fontFamily.body'),
          letterSpacing: 0.00625,
        },
        labelMedium: {
          fontSize: 0.75,
          lineHeight: 1,
          fontFamily: theme('fontFamily.body'),
          letterSpacing: 0.03125,
        },
        labelSmall: {
          fontSize: 0.6875,
          lineHeight: 1,
          fontFamily: theme('fontFamily.body'),
          letterSpacing: 0.03125,
        },
        bodyLarge: {
          fontSize: 1,
          lineHeight: 1.5625,
          fontFamily: theme('fontFamily.body'),
          letterSpacing: 0.03125,
        },
        bodyMedium: {
          fontSize: 0.875,
          lineHeight: 1.25,
          fontFamily: theme('fontFamily.body'),
          letterSpacing: 0.015625,
        },
        bodySmall: {
          fontSize: 0.75,
          lineHeight: 1,
          fontFamily: theme('fontFamily.body'),
          letterSpacing: 0.025,
        },
      };
      const responsiveBreakPoints = {
        lg: 1.125,
      };

      for (let [key, value] of Object.entries(typographyStyles)) {
        key = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

        let newUtilies = {
          ['.text-' + key]: {
            fontSize: value.fontSize + pixelUnit,
            lineHeight: value.lineHeight + pixelUnit,
            letterSpacing: value.letterSpacing
              ? value.letterSpacing + pixelUnit
              : undefined,
            fontFamily: value.fontFamily,
            ...Object.entries(responsiveBreakPoints).reduce(
              (acc, [breakPointName, breakPointRatio]) => {
                acc = {
                  ...acc,
                  [`@media (min-width: ${theme(
                    'screens.' + breakPointName,
                    {}
                  )})`]: {
                    fontSize: value.fontSize * breakPointRatio + pixelUnit,
                    lineHeight: value.lineHeight * breakPointRatio + pixelUnit,
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
};

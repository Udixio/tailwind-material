import plugin from 'tailwindcss/plugin';
import { CSSRuleObject } from 'tailwindcss/types/config';
import { ExtendTheme, Theme } from '../utils';
import { ExportableTheme, ThemeFigma } from '../figma';

export type FontStyle = {
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

export interface FontThemeOption {
  fontFamily?: { expressive?: string[]; neutral?: string[] };
  responsiveBreakPoints?: Record<string, number>;
  fontStyles?: Record<FontRole, Record<FontSize, FontStyle>>;
}

export type FontRole = 'display' | 'headline' | 'title' | 'label' | 'body';
export type FontSize = 'large' | 'medium' | 'small';

export class FontTheme implements ExtendTheme, ExportableTheme {
  fontFamily: { expressive: string[]; neutral: string[] };
  responsiveBreakPoints: Record<string, number>;
  fontStyles: Record<FontRole, Record<FontSize, FontStyle>>;
  private pixelUnit = 'rem';

  constructor(args?: FontThemeOption) {
    this.fontFamily = {
      expressive: args?.fontFamily?.expressive ?? ['Roboto', 'sans-serif'],
      neutral: args?.fontFamily?.neutral ?? ['Roboto', 'sans-serif'],
    };
    this.responsiveBreakPoints = args?.responsiveBreakPoints ?? {
      lg: 1.125,
    };

    this.fontStyles = {
      display: {
        large: {
          fontWeight: 400,
          fontSize: 3.5625,
          lineHeight: 4,
          letterSpacing: -0.015625,
          fontFamily: FontFamily.Expressive,
        },
        medium: {
          fontWeight: 400,
          fontSize: 2.8125,
          lineHeight: 3.25,
          fontFamily: FontFamily.Expressive,
        },
        small: {
          fontWeight: 400,
          fontSize: 2.25,
          lineHeight: 2.75,
          fontFamily: FontFamily.Expressive,
        },
      },
      headline: {
        large: {
          fontWeight: 400,
          fontSize: 2,
          lineHeight: 2.5,
          fontFamily: FontFamily.Expressive,
        },
        medium: {
          fontWeight: 400,
          fontSize: 1.75,
          lineHeight: 2.25,
          fontFamily: FontFamily.Expressive,
        },
        small: {
          fontWeight: 400,
          fontSize: 1.5,
          lineHeight: 2,
          fontFamily: FontFamily.Expressive,
        },
      },
      title: {
        large: {
          fontWeight: 400,
          fontSize: 1.375,
          lineHeight: 1.75,
          fontFamily: FontFamily.Neutral,
        },
        medium: {
          fontWeight: 500,
          fontSize: 1,
          lineHeight: 1.5,
          fontFamily: FontFamily.Neutral,
          letterSpacing: 0.009375,
        },
        small: {
          fontWeight: 500,
          fontSize: 0.875,
          lineHeight: 1.25,
          fontFamily: FontFamily.Neutral,
          letterSpacing: 0.00625,
        },
      },
      label: {
        large: {
          fontWeight: 500,
          fontSize: 0.875,
          lineHeight: 1.25,
          fontFamily: FontFamily.Neutral,
          letterSpacing: 0.00625,
        },
        medium: {
          fontWeight: 500,
          fontSize: 0.75,
          lineHeight: 1,
          fontFamily: FontFamily.Neutral,
          letterSpacing: 0.03125,
        },
        small: {
          fontWeight: 500,
          fontSize: 0.6875,
          lineHeight: 1,
          fontFamily: FontFamily.Neutral,
          letterSpacing: 0.03125,
        },
      },
      body: {
        large: {
          fontWeight: 400,
          fontSize: 1,
          lineHeight: 1.5625,
          fontFamily: FontFamily.Neutral,
          letterSpacing: 0.03125,
        },
        medium: {
          fontWeight: 400,
          fontSize: 0.875,
          lineHeight: 1.25,
          fontFamily: FontFamily.Neutral,
          letterSpacing: 0.015625,
        },
        small: {
          fontWeight: 400,
          fontSize: 0.75,
          lineHeight: 1,
          fontFamily: FontFamily.Neutral,
          letterSpacing: 0.025,
        },
      },
    };
    if (args && args.fontStyles)
      Object.entries(args.fontStyles).forEach(([key, value]) => {
        this.fontStyles[key as FontRole] = {
          ...this.fontStyles[key as FontRole],
          ...value,
        };
      });
  }

  updateTheme(theme: Theme): Theme {
    theme.fontFamily = {
      expressive: this.fontFamily?.expressive,
      neutral: this.fontFamily?.neutral,
    };

    theme.plugins.push(
      plugin(({ addUtilities, theme }) => {
        const newUtilities = this.createUtilities(theme);
        addUtilities(newUtilities);
      })
    );

    return theme;
  }

  private createUtilities(theme: any): CSSRuleObject {
    const newUtilities: { [key: string]: CSSRuleObject } = {};
    for (let [roleName, roleValue] of Object.entries(this.fontStyles)) {
      for (let [sizeName, sizeValue] of Object.entries(roleValue)) {
        newUtilities['.text-' + roleName + '-' + sizeName] = {
          fontSize: sizeValue.fontSize + this.pixelUnit,
          fontWeight: sizeValue.fontWeight as unknown as CSSRuleObject,
          lineHeight: sizeValue.lineHeight + this.pixelUnit,
          letterSpacing: sizeValue.letterSpacing
            ? sizeValue.letterSpacing + this.pixelUnit
            : null,
          fontFamily: theme('fontFamily.' + sizeValue.fontFamily),
          ...Object.entries(this.responsiveBreakPoints).reduce(
            (acc, [breakPointName, breakPointRatio]) => {
              acc = {
                ...acc,
                [`@media (min-width: ${theme(
                  'screens.' + breakPointName,
                  {}
                )})`]: {
                  fontSize:
                    sizeValue.fontSize * breakPointRatio + this.pixelUnit,
                  lineHeight:
                    sizeValue.lineHeight * breakPointRatio + this.pixelUnit,
                },
              } as any;
              return acc;
            },
            {}
          ),
        };
      }
    }

    return newUtilities as CSSRuleObject;
  }
}

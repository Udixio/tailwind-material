// from tailwindcss src/util/flattenColorPalette
import plugin from 'tailwindcss/plugin';
import { ExtendTheme, Theme } from '../utils';
import { PluginAPI } from 'tailwindcss/types/config';

type State = {
  statePrefix: string;
  disabledStyles: {
    textOpacity: number;
    backgroundOpacity: number;
  };
  transition: {
    duration: number;
  };
};

type Components = Record<string, Record<string, {}>>;

export class StateTheme implements ExtendTheme {
  updateTheme(theme: Theme): Theme {
    theme.plugins.push(
      plugin((pluginArgs: PluginAPI) => {
        this.addAllNewComponents(pluginArgs, {
          statePrefix: 'state',
          disabledStyles: {
            textOpacity: 0.38,
            backgroundOpacity: 0.12,
          },
          transition: {
            duration: 150,
          },
        });
      }, {})
    );

    return theme;
  }

  private flattenColorPalette(
    colors: Record<string, any>
  ): Record<string, any> {
    return Object.assign(
      {},
      ...Object.entries(colors ?? {}).flatMap(
        ([color, values]: [color: string, values: any]) => {
          if (typeof values == 'object') {
            return Object.entries(this.flattenColorPalette(values)).map(
              ([number, hex]: [number: string, hex: any]) => {
                let className = color;
                if (number !== 'DEFAULT') {
                  className += `-${number}`;
                }
                return { [className]: hex };
              }
            );
          } else {
            return [{ [color]: values }];
          }
        }
      )
    );
  }

  private addAllNewComponents(
    { addComponents, theme }: PluginAPI,
    { statePrefix, disabledStyles, transition }: State
  ) {
    const colors = this.flattenColorPalette(theme('colors') || {});

    const materialColors = Object.keys(colors).filter(
      (colorName) => colors[`${colorName}-light`]
    );

    let newComponents: Components = {};

    for (const colorName of materialColors) {
      const className = `.${statePrefix}-${colorName}`;
      newComponents[className] = {
        [`@apply hover:bg-${colorName}/[0.08]`]: {},
        [`@apply active:bg-${colorName}/[0.12]`]: {},
        [`@apply focus-visible:bg-${colorName}/[0.12]`]: {},
      };
      if (transition) {
        newComponents[className][`@apply transition-colors`] = {};
        newComponents[className][`@apply duration-${transition.duration}`] = {};
      }
      if (disabledStyles) {
        newComponents[className][
          `@apply disabled:text-on-surface/[${disabledStyles.textOpacity}]`
        ] = {};
        newComponents[className][
          `@apply disabled:bg-on-surface/[${disabledStyles.backgroundOpacity}]`
        ] = {};
      }
    }

    addComponents(newComponents);
  }
}

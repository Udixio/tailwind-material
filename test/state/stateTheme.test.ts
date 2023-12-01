import { StateTheme } from '../../src';
import { colors, result, state } from './stateTheme.stub';

import { PluginAPI } from 'tailwindcss/types/config';
import plugin from 'tailwindcss/plugin';

describe('stateTheme', () => {
  let theme: StateTheme;
  beforeEach(() => {
    theme = new StateTheme();
  });

  let colorsFlatten;
  describe('flattenColorPalette', () => {
    it('all colors should be flatten', () => {
      colorsFlatten = theme['flattenColors'](colors);
      for (const [key, value] of Object.entries(colorsFlatten)) {
        expect(typeof key).toBe('string');
        expect(typeof value).toBe('string');
      }
    });
  });

  describe('addAllNewComponents', () => {
    it('all colors should be flatten', () => {
      plugin((pluginArgs: PluginAPI) => {
        const materialColors = Object.keys(result).filter(
          (colorName) => colors[`${colorName}-light`]
        );

        let newComponents = {};

        for (const colorName of materialColors) {
          const className = `.${state.statePrefix}-${colorName}`;
          newComponents[className] = {
            [`@apply hover:bg-${colorName}/[0.08]`]: {},
            [`@apply active:bg-${colorName}/[0.12]`]: {},
            [`@apply focus-visible:bg-${colorName}/[0.12]`]: {},
          };
          if (state.transition) {
            newComponents[className][`@apply transition-colors`] = {};
            newComponents[className][
              `@apply duration-${state.transition.duration}`
            ] = {};
          }
          if (state.disabledStyles) {
            newComponents[className][
              `@apply disabled:text-on-surface/[${state.disabledStyles.textOpacity}]`
            ] = {};
            newComponents[className][
              `@apply disabled:bg-on-surface/[${state.disabledStyles.backgroundOpacity}]`
            ] = {};
          }
        }

        expect(pluginArgs.addComponents).toBeCalledWith(newComponents);
      }, {});
    });
  });
});

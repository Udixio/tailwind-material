// from tailwindcss src/util/flattenColorPalette
import plugin from "tailwindcss/plugin";

const flattenColorPalette = (colors: any): any =>
  Object.assign(
    {},
    ...Object.entries(colors ?? {}).flatMap(([color, values]) =>
      typeof values == "object"
        ? Object.entries(flattenColorPalette(values)).map(([number, hex]) => ({
            [color + (number === "DEFAULT" ? "" : `-${number}`)]: hex,
          }))
        : [{ [`${color}`]: values }]
    )
  );

export function materialStates() {
  const { statePrefix, disabledStyles, transition } = {
    statePrefix: "state",
    disabledStyles: {
      textOpacity: 0.38,
      backgroundOpacity: 0.12,
    },
    transition: {
      duration: 150,
    },
  };

  return {
    plugin: plugin(({ addComponents, theme }) => {
      const colors = flattenColorPalette(theme("colors") || {});

      const materialColors = Object.keys(colors).filter(
        (colorName) => colors[`${colorName}-light`]
      );

      let newComponents: { [key: string]: { [key: string]: {} } } = {};

      materialColors.forEach((colorName) => {
        newComponents[`.${statePrefix}-${colorName}`] = {
          [`@apply hover:bg-${colorName}/[0.08]`]: {},
          [`@apply active:bg-${colorName}/[0.12]`]: {},
          [`@apply focus-visible:bg-${colorName}/[0.12]`]: {},
          ...(transition
            ? {
                [`@apply transition-colors`]: {},
                [`@apply duration-${transition.duration}`]: {},
              }
            : {}),
          ...(disabledStyles
            ? {
                [`@apply disabled:text-on-surface/[${disabledStyles.textOpacity}]`]:
                  {},
                [`@apply disabled:bg-on-surface/[${disabledStyles.backgroundOpacity}]`]:
                  {},
              }
            : {}),
        };
      });

      addComponents(newComponents);
    }, {}),
  };
}

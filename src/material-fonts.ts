import plugin from 'tailwindcss/plugin';

export const materialFonts = () => {
  return {
    fontFamily: {
      roboto: ['Roboto', 'sans-serif'],
    },
    plugin: plugin(({ addComponents, theme }) => {
      const newComponents = {
        '.title-small': {
          fontFamily: theme('fontFamily.roboto') as string,
          fontSize: theme('fontSize.sm') as string,
          lineHeight: theme('lineHeight.tight') as string,
          letterSpacing: theme('letterSpacing.wide') as string,
          fontWeight: theme('fontWeight.medium') as string,
        },
      };

      addComponents(newComponents);
    }, {}),
  };
};

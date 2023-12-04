# Installation

This guide will demonstrate the installation procedure of the package.

## Prerequisites

Below are the steps to add and configure the package in your project:

## Installation Steps

Below are the steps to add and configure the package in your project:

1. Install the package using npm by executing the following command in the terminal:

    ```bash
    npm i @udixio/tailwind-material
    ```

2. Update your Tailwind configuration file (`tailwind.config.ts`). Here's a simple setup:

    ```Typescript
    import type { Config } from 'tailwindcss';
    import {createConfig} from '@udixio/tailwind-material/src';
    
    const config: Config = createConfig(
      {
        //Your config Tailwind
      },
      {
        colorPalette: {
          primary: '#6750A4',
        },
      }
    );
    
    export default config;
    ```
    
    > For greater flexibility in customizing your Tailwind theme, consider using the createTheme function:
    >
    {style="note"}
   
    ``` typescript
    import type { Config } from 'tailwindcss';
    import {createTheme} from '../tailwind-material/src';
    
    const themeTailwindMaterial = createTheme({
        colorPalette: {
            primary: '#6750A4',
        },
    });
    
    const config: Config = {
    //Your config Tailwind
        theme: {
            fontFamily: themeTailwindMaterial.fontFamily,
            colors: themeTailwindMaterial.colors,
            extend: {
                boxShadow: {
                    '1': '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
                    '2': '0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
                    '3': '0px 1px 3px 0px rgba(0, 0, 0, 0.30), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)',
                    '4': '0px 2px 3px 0px rgba(0, 0, 0, 0.30), 0px 6px 10px 4px rgba(0, 0, 0, 0.15)',
                    '5': '0px 4px 4px 0px rgba(0, 0, 0, 0.30), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)',
                },
            },
        },
        plugins: themeTailwindMaterial.plugins,
    };
    export default config;
    ```
    {collapsible="true" collapsed-title="const themeTailwindMaterial = createTheme"}

## Configuration

This is the second part of the tutorial:

1. Step 1
2. Step 2
3. Step n

## What you've learned {id="what-learned"}

Summarize what the reader achieved by completing this tutorial.

<seealso>
<!--Give some related links to how-to articles-->
</seealso>

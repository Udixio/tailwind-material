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

2. Adjust your Tailwind configuration file (`tailwind.config.ts`) with the following content:

```Typescript
import type { Config } from 'tailwindcss';

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

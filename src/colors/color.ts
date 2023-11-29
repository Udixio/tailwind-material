import {
  DynamicColor,
  DynamicScheme,
  hexFromArgb,
  TonalPalette,
} from '@material/material-color-utilities';
import { ContrastCurve } from './material-color-utilities/contrastCurve';

export interface ColorOptions {
  name: string;
  palette: (scheme: DynamicScheme) => TonalPalette;
  tone: (scheme: DynamicScheme) => number;
  isBackground?: boolean;
  background?: (scheme: DynamicScheme) => DynamicColor;
  secondBackground?: (scheme: DynamicScheme) => DynamicColor;
  contrastCurve?: ContrastCurve;
  toneDeltaPair?: (scheme: DynamicScheme) => {
    roleA: DynamicColor;
    readonly roleB: DynamicColor;
    readonly delta: number;
    readonly polarity: 'darker' | 'lighter' | 'nearer' | 'farther';
    readonly stayTogether: boolean;
  };
}

export class Color {
  constructor(private option: Partial<ColorOptions> & { name: string }) {}

  update(args: Partial<ColorOptions>) {
    this.option = {
      ...this.option,
      ...args,
    };
  }
  getHex(scheme: DynamicScheme): string {
    return hexFromArgb(this.getArgb(scheme)).toUpperCase();
  }

  getArgb(scheme: DynamicScheme) {
    return this.getDynamicColor().getArgb(scheme);
  }

  getName(): string {
    return this.option.name;
  }

  private getDynamicColor(): DynamicColor {
    const option = this.option;
    if (option && option.palette && option.tone && option.name) {
      return DynamicColor.fromPalette(option as ColorOptions);
    }
    throw new Error(`Invalid option: ${JSON.stringify(option)}`);
  }
}

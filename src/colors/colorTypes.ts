import {
  DynamicColor,
  DynamicScheme,
  TonalPalette,
} from '@material/material-color-utilities';
import { ContrastCurve } from './contrastCurve';

export interface DynamicColorOptions {
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

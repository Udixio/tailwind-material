/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License"),
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  DislikeAnalyzer,
  DynamicColor,
  DynamicScheme,
  Hct,
} from '@material/material-color-utilities';
import { Variant } from './variant';
import { ContrastCurve, ToneDeltaPair } from './material-color-utilities';

function isFidelity(scheme: DynamicScheme): boolean {
  return (
    scheme.variant === Variant.FIDELITY || scheme.variant === Variant.CONTENT
  );
}

function isMonochrome(scheme: DynamicScheme): boolean {
  return scheme.variant === Variant.MONOCHROME;
}

function findDesiredChromaByTone(
  hue: number,
  chroma: number,
  tone: number,
  byDecreasingTone: boolean
): number {
  let answer = tone;

  let closestToChroma = Hct.from(hue, chroma, tone);
  if (closestToChroma.chroma < chroma) {
    let chromaPeak = closestToChroma.chroma;
    while (closestToChroma.chroma < chroma) {
      answer += byDecreasingTone ? -1.0 : 1.0;
      const potentialSolution = Hct.from(hue, chroma, answer);
      if (chromaPeak > potentialSolution.chroma) {
        break;
      }
      if (Math.abs(potentialSolution.chroma - chroma) < 0.4) {
        break;
      }

      const potentialDelta = Math.abs(potentialSolution.chroma - chroma);
      const currentDelta = Math.abs(closestToChroma.chroma - chroma);
      if (potentialDelta < currentDelta) {
        closestToChroma = potentialSolution;
      }
      chromaPeak = Math.max(chromaPeak, potentialSolution.chroma);
    }
  }

  return answer;
}
export type DynamicColorKey =
  | 'background'
  | 'onBackground'
  | 'surface'
  | 'surfaceDim'
  | 'surfaceBright'
  | 'surfaceContainerLowest'
  | 'surfaceContainerLow'
  | 'surfaceContainer'
  | 'surfaceContainerHigh'
  | 'surfaceContainerHighest'
  | 'onSurface'
  | 'surfaceVariant'
  | 'onSurfaceVariant'
  | 'inverseSurface'
  | 'inverseOnSurface'
  | 'outline'
  | 'outlineVariant'
  | 'shadow'
  | 'scrim'
  | 'surfaceTint'
  | 'primary'
  | 'onPrimary'
  | 'primaryContainer'
  | 'onPrimaryContainer'
  | 'inversePrimary'
  | 'secondary'
  | 'onSecondary'
  | 'secondaryContainer'
  | 'onSecondaryContainer'
  | 'tertiary'
  | 'onTertiary'
  | 'tertiaryContainer'
  | 'onTertiaryContainer'
  | 'error'
  | 'onError'
  | 'errorContainer'
  | 'onErrorContainer'
  | 'primaryFixed'
  | 'primaryFixedDim'
  | 'onPrimaryFixed'
  | 'onPrimaryFixedVariant'
  | 'secondaryFixed'
  | 'secondaryFixedDim'
  | 'onSecondaryFixed'
  | 'onSecondaryFixedVariant'
  | 'tertiaryFixed'
  | 'tertiaryFixedDim'
  | 'onTertiaryFixed'
  | 'onTertiaryFixedVariant';

/**
 * DynamicColors for the colors in the Material Design system.
 Modifications:
 - Added colorMap to handle dynamic color assignments.
 - Added getColor and setColor methods for managing colors in colorMap.
 */
// Material Color Utilities namespaces the various utilities it provides.
// tslint:disable-next-line:class-as-namespace
export class MaterialDynamicColors {
  private static colorMap: Record<DynamicColorKey, DynamicColor> = {
    background: DynamicColor.fromPalette({
      name: 'background',
      palette: (s) => s.neutralPalette,
      tone: (s) => (s.isDark ? 6 : 98),
      isBackground: true,
    }),
    onBackground: DynamicColor.fromPalette({
      name: 'on_background',
      palette: (s) => s.neutralPalette,
      tone: (s) => (s.isDark ? 90 : 10),
      background: (s) => MaterialDynamicColors.getColor('background'),
      contrastCurve: new ContrastCurve(3, 3, 4.5, 7),
    }),
    surface: DynamicColor.fromPalette({
      name: 'surface',
      palette: (s) => s.neutralPalette,
      tone: (s) => (s.isDark ? 6 : 98),
      isBackground: true,
    }),
    surfaceDim: DynamicColor.fromPalette({
      name: 'surface_dim',
      palette: (s) => s.neutralPalette,
      tone: (s) => (s.isDark ? 6 : 87),
      isBackground: true,
    }),
    surfaceBright: DynamicColor.fromPalette({
      name: 'surface_bright',
      palette: (s) => s.neutralPalette,
      tone: (s) => (s.isDark ? 24 : 98),
      isBackground: true,
    }),
    surfaceContainerLowest: DynamicColor.fromPalette({
      name: 'surface_container_lowest',
      palette: (s) => s.neutralPalette,
      tone: (s) => (s.isDark ? 4 : 100),
      isBackground: true,
    }),
    surfaceContainerLow: DynamicColor.fromPalette({
      name: 'surface_container_low',
      palette: (s) => s.neutralPalette,
      tone: (s) => (s.isDark ? 10 : 96),
      isBackground: true,
    }),
    surfaceContainer: DynamicColor.fromPalette({
      name: 'surface_container',
      palette: (s) => s.neutralPalette,
      tone: (s) => (s.isDark ? 12 : 94),
      isBackground: true,
    }),
    surfaceContainerHigh: DynamicColor.fromPalette({
      name: 'surface_container_high',
      palette: (s) => s.neutralPalette,
      tone: (s) => (s.isDark ? 17 : 92),
      isBackground: true,
    }),
    surfaceContainerHighest: DynamicColor.fromPalette({
      name: 'surface_container_highest',
      palette: (s) => s.neutralPalette,
      tone: (s) => (s.isDark ? 22 : 90),
      isBackground: true,
    }),
    onSurface: DynamicColor.fromPalette({
      name: 'on_surface',
      palette: (s) => s.neutralPalette,
      tone: (s) => (s.isDark ? 90 : 10),
      background: (s) => MaterialDynamicColors.highestSurface(s),
      contrastCurve: new ContrastCurve(4.5, 7, 11, 21),
    }),
    surfaceVariant: DynamicColor.fromPalette({
      name: 'surface_variant',
      palette: (s) => s.neutralVariantPalette,
      tone: (s) => (s.isDark ? 30 : 90),
      isBackground: true,
    }),
    onSurfaceVariant: DynamicColor.fromPalette({
      name: 'on_surface_variant',
      palette: (s) => s.neutralVariantPalette,
      tone: (s) => (s.isDark ? 80 : 30),
      background: (s) => MaterialDynamicColors.highestSurface(s),
      contrastCurve: new ContrastCurve(3, 4.5, 7, 11),
    }),
    inverseSurface: DynamicColor.fromPalette({
      name: 'inverse_surface',
      palette: (s) => s.neutralPalette,
      tone: (s) => (s.isDark ? 90 : 20),
    }),
    inverseOnSurface: DynamicColor.fromPalette({
      name: 'inverse_on_surface',
      palette: (s) => s.neutralPalette,
      tone: (s) => (s.isDark ? 20 : 95),
      background: (s) => MaterialDynamicColors.getColor('inverseSurface'),
      contrastCurve: new ContrastCurve(4.5, 7, 11, 21),
    }),
    outline: DynamicColor.fromPalette({
      name: 'outline',
      palette: (s) => s.neutralVariantPalette,
      tone: (s) => (s.isDark ? 60 : 50),
      background: (s) => MaterialDynamicColors.highestSurface(s),
      contrastCurve: new ContrastCurve(1.5, 3, 4.5, 7),
    }),
    outlineVariant: DynamicColor.fromPalette({
      name: 'outline_variant',
      palette: (s) => s.neutralVariantPalette,
      tone: (s) => (s.isDark ? 30 : 80),
      background: (s) => MaterialDynamicColors.highestSurface(s),
      contrastCurve: new ContrastCurve(1, 1, 3, 7),
    }),
    shadow: DynamicColor.fromPalette({
      name: 'shadow',
      palette: (s) => s.neutralPalette,
      tone: (s) => 0,
    }),
    scrim: DynamicColor.fromPalette({
      name: 'scrim',
      palette: (s) => s.neutralPalette,
      tone: (s) => 0,
    }),
    surfaceTint: DynamicColor.fromPalette({
      name: 'surface_tint',
      palette: (s) => s.primaryPalette,
      tone: (s) => (s.isDark ? 80 : 40),
      isBackground: true,
    }),
    primary: DynamicColor.fromPalette({
      name: 'primary',
      palette: (s) => s.primaryPalette,
      tone: (s) => {
        if (isMonochrome(s)) {
          return s.isDark ? 100 : 0;
        }
        return s.isDark ? 80 : 40;
      },
      isBackground: true,
      background: (s) => MaterialDynamicColors.highestSurface(s),
      contrastCurve: new ContrastCurve(3, 4.5, 7, 11),
      toneDeltaPair: (s) =>
        new ToneDeltaPair(
          MaterialDynamicColors.getColor('primaryContainer'),
          MaterialDynamicColors.getColor('primary'),
          15,
          'nearer',
          false
        ),
    }),
    onPrimary: DynamicColor.fromPalette({
      name: 'on_primary',
      palette: (s) => s.primaryPalette,
      tone: (s) => {
        if (isMonochrome(s)) {
          return s.isDark ? 10 : 90;
        }
        return s.isDark ? 20 : 100;
      },
      background: (s) => MaterialDynamicColors.getColor('primary'),
      contrastCurve: new ContrastCurve(4.5, 7, 11, 21),
    }),
    primaryContainer: DynamicColor.fromPalette({
      name: 'primary_container',
      palette: (s) => s.primaryPalette,
      tone: (s) => {
        if (isFidelity(s)) {
          return s.sourceColorHct.tone;
        }
        if (isMonochrome(s)) {
          return s.isDark ? 85 : 25;
        }
        return s.isDark ? 30 : 90;
      },
      isBackground: true,
      background: (s) => MaterialDynamicColors.highestSurface(s),
      contrastCurve: new ContrastCurve(1, 1, 3, 7),
      toneDeltaPair: (s) =>
        new ToneDeltaPair(
          MaterialDynamicColors.getColor('primaryContainer'),
          MaterialDynamicColors.getColor('primary'),
          15,
          'nearer',
          false
        ),
    }),
    onPrimaryContainer: DynamicColor.fromPalette({
      name: 'on_primary_container',
      palette: (s) => s.primaryPalette,
      tone: (s) => {
        if (isFidelity(s)) {
          return DynamicColor.foregroundTone(
            MaterialDynamicColors.getColor('primaryContainer').tone(s),
            4.5
          );
        }
        if (isMonochrome(s)) {
          return s.isDark ? 0 : 100;
        }
        return s.isDark ? 90 : 10;
      },
      background: (s) => MaterialDynamicColors.getColor('primaryContainer'),
      contrastCurve: new ContrastCurve(4.5, 7, 11, 21),
    }),
    inversePrimary: DynamicColor.fromPalette({
      name: 'inverse_primary',
      palette: (s) => s.primaryPalette,
      tone: (s) => (s.isDark ? 40 : 80),
      background: (s) => MaterialDynamicColors.getColor('inverseSurface'),
      contrastCurve: new ContrastCurve(3, 4.5, 7, 11),
    }),
    secondary: DynamicColor.fromPalette({
      name: 'secondary',
      palette: (s) => s.secondaryPalette,
      tone: (s) => (s.isDark ? 80 : 40),
      isBackground: true,
      background: (s) => MaterialDynamicColors.highestSurface(s),
      contrastCurve: new ContrastCurve(3, 4.5, 7, 11),
      toneDeltaPair: (s) =>
        new ToneDeltaPair(
          MaterialDynamicColors.getColor('secondaryContainer'),
          MaterialDynamicColors.getColor('secondary'),
          15,
          'nearer',
          false
        ),
    }),
    onSecondary: DynamicColor.fromPalette({
      name: 'on_secondary',
      palette: (s) => s.secondaryPalette,
      tone: (s) => {
        if (isMonochrome(s)) {
          return s.isDark ? 10 : 100;
        } else {
          return s.isDark ? 20 : 100;
        }
      },
      background: (s) => MaterialDynamicColors.getColor('secondary'),
      contrastCurve: new ContrastCurve(4.5, 7, 11, 21),
    }),
    secondaryContainer: DynamicColor.fromPalette({
      name: 'secondary_container',
      palette: (s) => s.secondaryPalette,
      tone: (s) => {
        const initialTone = s.isDark ? 30 : 90;
        if (isMonochrome(s)) {
          return s.isDark ? 30 : 85;
        }
        if (!isFidelity(s)) {
          return initialTone;
        }
        return findDesiredChromaByTone(
          s.secondaryPalette.hue,
          s.secondaryPalette.chroma,
          initialTone,
          !s.isDark
        );
      },
      isBackground: true,
      background: (s) => MaterialDynamicColors.highestSurface(s),
      contrastCurve: new ContrastCurve(1, 1, 3, 7),
      toneDeltaPair: (s) =>
        new ToneDeltaPair(
          MaterialDynamicColors.getColor('secondaryContainer'),
          MaterialDynamicColors.getColor('secondary'),
          15,
          'nearer',
          false
        ),
    }),
    onSecondaryContainer: DynamicColor.fromPalette({
      name: 'on_secondary_container',
      palette: (s) => s.secondaryPalette,
      tone: (s) => {
        if (!isFidelity(s)) {
          return s.isDark ? 90 : 10;
        }
        return DynamicColor.foregroundTone(
          MaterialDynamicColors.getColor('secondaryContainer').tone(s),
          4.5
        );
      },
      background: (s) => MaterialDynamicColors.getColor('secondaryContainer'),
      contrastCurve: new ContrastCurve(4.5, 7, 11, 21),
    }),
    tertiary: DynamicColor.fromPalette({
      name: 'tertiary',
      palette: (s) => s.tertiaryPalette,
      tone: (s) => {
        if (isMonochrome(s)) {
          return s.isDark ? 90 : 25;
        }
        return s.isDark ? 80 : 40;
      },
      isBackground: true,
      background: (s) => MaterialDynamicColors.highestSurface(s),
      contrastCurve: new ContrastCurve(3, 4.5, 7, 11),
      toneDeltaPair: (s) =>
        new ToneDeltaPair(
          MaterialDynamicColors.getColor('tertiaryContainer'),
          MaterialDynamicColors.getColor('tertiary'),
          15,
          'nearer',
          false
        ),
    }),
    onTertiary: DynamicColor.fromPalette({
      name: 'on_tertiary',
      palette: (s) => s.tertiaryPalette,
      tone: (s) => {
        if (isMonochrome(s)) {
          return s.isDark ? 10 : 90;
        }
        return s.isDark ? 20 : 100;
      },
      background: (s) => MaterialDynamicColors.getColor('tertiary'),
      contrastCurve: new ContrastCurve(4.5, 7, 11, 21),
    }),
    tertiaryContainer: DynamicColor.fromPalette({
      name: 'tertiary_container',
      palette: (s) => s.tertiaryPalette,
      tone: (s) => {
        if (isMonochrome(s)) {
          return s.isDark ? 60 : 49;
        }
        if (!isFidelity(s)) {
          return s.isDark ? 30 : 90;
        }
        const proposedHct = s.tertiaryPalette.getHct(s.sourceColorHct.tone);
        return DislikeAnalyzer.fixIfDisliked(proposedHct).tone;
      },
      isBackground: true,
      background: (s) => MaterialDynamicColors.highestSurface(s),
      contrastCurve: new ContrastCurve(1, 1, 3, 7),
      toneDeltaPair: (s) =>
        new ToneDeltaPair(
          MaterialDynamicColors.getColor('tertiaryContainer'),
          MaterialDynamicColors.getColor('tertiary'),
          15,
          'nearer',
          false
        ),
    }),
    onTertiaryContainer: DynamicColor.fromPalette({
      name: 'on_tertiary_container',
      palette: (s) => s.tertiaryPalette,
      tone: (s) => {
        if (isMonochrome(s)) {
          return s.isDark ? 0 : 100;
        }
        if (!isFidelity(s)) {
          return s.isDark ? 90 : 10;
        }
        return DynamicColor.foregroundTone(
          MaterialDynamicColors.getColor('tertiaryContainer').tone(s),
          4.5
        );
      },
      background: (s) => MaterialDynamicColors.getColor('tertiaryContainer'),
      contrastCurve: new ContrastCurve(4.5, 7, 11, 21),
    }),
    error: DynamicColor.fromPalette({
      name: 'error',
      palette: (s) => s.errorPalette,
      tone: (s) => (s.isDark ? 80 : 40),
      isBackground: true,
      background: (s) => MaterialDynamicColors.highestSurface(s),
      contrastCurve: new ContrastCurve(3, 4.5, 7, 11),
      toneDeltaPair: (s) =>
        new ToneDeltaPair(
          MaterialDynamicColors.getColor('errorContainer'),
          MaterialDynamicColors.getColor('error'),
          15,
          'nearer',
          false
        ),
    }),
    onError: DynamicColor.fromPalette({
      name: 'on_error',
      palette: (s) => s.errorPalette,
      tone: (s) => (s.isDark ? 20 : 100),
      background: (s) => MaterialDynamicColors.getColor('error'),
      contrastCurve: new ContrastCurve(4.5, 7, 11, 21),
    }),
    errorContainer: DynamicColor.fromPalette({
      name: 'error_container',
      palette: (s) => s.errorPalette,
      tone: (s) => (s.isDark ? 30 : 90),
      isBackground: true,
      background: (s) => MaterialDynamicColors.highestSurface(s),
      contrastCurve: new ContrastCurve(1, 1, 3, 7),
      toneDeltaPair: (s) =>
        new ToneDeltaPair(
          MaterialDynamicColors.getColor('errorContainer'),
          MaterialDynamicColors.getColor('error'),
          15,
          'nearer',
          false
        ),
    }),
    onErrorContainer: DynamicColor.fromPalette({
      name: 'on_error_container',
      palette: (s) => s.errorPalette,
      tone: (s) => (s.isDark ? 90 : 10),
      background: (s) => MaterialDynamicColors.getColor('errorContainer'),
      contrastCurve: new ContrastCurve(4.5, 7, 11, 21),
    }),
    primaryFixed: DynamicColor.fromPalette({
      name: 'primary_fixed',
      palette: (s) => s.primaryPalette,
      tone: (s) => (isMonochrome(s) ? 40.0 : 90.0),
      isBackground: true,
      background: (s) => MaterialDynamicColors.highestSurface(s),
      contrastCurve: new ContrastCurve(1, 1, 3, 7),
      toneDeltaPair: (s) =>
        new ToneDeltaPair(
          MaterialDynamicColors.getColor('primaryFixed'),
          MaterialDynamicColors.getColor('primaryFixedDim'),
          10,
          'lighter',
          true
        ),
    }),
    primaryFixedDim: DynamicColor.fromPalette({
      name: 'primary_fixed_dim',
      palette: (s) => s.primaryPalette,
      tone: (s) => (isMonochrome(s) ? 30.0 : 80.0),
      isBackground: true,
      background: (s) => MaterialDynamicColors.highestSurface(s),
      contrastCurve: new ContrastCurve(1, 1, 3, 7),
      toneDeltaPair: (s) =>
        new ToneDeltaPair(
          MaterialDynamicColors.getColor('primaryFixed'),
          MaterialDynamicColors.getColor('primaryFixedDim'),
          10,
          'lighter',
          true
        ),
    }),
    onPrimaryFixed: DynamicColor.fromPalette({
      name: 'on_primary_fixed',
      palette: (s) => s.primaryPalette,
      tone: (s) => (isMonochrome(s) ? 100.0 : 10.0),
      background: (s) => MaterialDynamicColors.getColor('primaryFixedDim'),
      secondBackground: (s) => MaterialDynamicColors.getColor('primaryFixed'),
      contrastCurve: new ContrastCurve(4.5, 7, 11, 21),
    }),
    onPrimaryFixedVariant: DynamicColor.fromPalette({
      name: 'on_primary_fixed_variant',
      palette: (s) => s.primaryPalette,
      tone: (s) => (isMonochrome(s) ? 90.0 : 30.0),
      background: (s) => MaterialDynamicColors.getColor('primaryFixedDim'),
      secondBackground: (s) => MaterialDynamicColors.getColor('primaryFixed'),
      contrastCurve: new ContrastCurve(3, 4.5, 7, 11),
    }),
    secondaryFixed: DynamicColor.fromPalette({
      name: 'secondary_fixed',
      palette: (s) => s.secondaryPalette,
      tone: (s) => (isMonochrome(s) ? 80.0 : 90.0),
      isBackground: true,
      background: (s) => MaterialDynamicColors.highestSurface(s),
      contrastCurve: new ContrastCurve(1, 1, 3, 7),
      toneDeltaPair: (s) =>
        new ToneDeltaPair(
          MaterialDynamicColors.getColor('secondaryFixed'),
          MaterialDynamicColors.getColor('secondaryFixedDim'),
          10,
          'lighter',
          true
        ),
    }),
    secondaryFixedDim: DynamicColor.fromPalette({
      name: 'secondary_fixed_dim',
      palette: (s) => s.secondaryPalette,
      tone: (s) => (isMonochrome(s) ? 70.0 : 80.0),
      isBackground: true,
      background: (s) => MaterialDynamicColors.highestSurface(s),
      contrastCurve: new ContrastCurve(1, 1, 3, 7),
      toneDeltaPair: (s) =>
        new ToneDeltaPair(
          MaterialDynamicColors.getColor('secondaryFixed'),
          MaterialDynamicColors.getColor('secondaryFixedDim'),
          10,
          'lighter',
          true
        ),
    }),
    onSecondaryFixed: DynamicColor.fromPalette({
      name: 'on_secondary_fixed',
      palette: (s) => s.secondaryPalette,
      tone: (s) => 10.0,
      background: (s) => MaterialDynamicColors.getColor('secondaryFixedDim'),
      secondBackground: (s) => MaterialDynamicColors.getColor('secondaryFixed'),
      contrastCurve: new ContrastCurve(4.5, 7, 11, 21),
    }),
    onSecondaryFixedVariant: DynamicColor.fromPalette({
      name: 'on_secondary_fixed_variant',
      palette: (s) => s.secondaryPalette,
      tone: (s) => (isMonochrome(s) ? 25.0 : 30.0),
      background: (s) => MaterialDynamicColors.getColor('secondaryFixedDim'),
      secondBackground: (s) => MaterialDynamicColors.getColor('secondaryFixed'),
      contrastCurve: new ContrastCurve(3, 4.5, 7, 11),
    }),
    tertiaryFixed: DynamicColor.fromPalette({
      name: 'tertiary_fixed',
      palette: (s) => s.tertiaryPalette,
      tone: (s) => (isMonochrome(s) ? 40.0 : 90.0),
      isBackground: true,
      background: (s) => MaterialDynamicColors.highestSurface(s),
      contrastCurve: new ContrastCurve(1, 1, 3, 7),
      toneDeltaPair: (s) =>
        new ToneDeltaPair(
          MaterialDynamicColors.getColor('tertiaryFixed'),
          MaterialDynamicColors.getColor('tertiaryFixedDim'),
          10,
          'lighter',
          true
        ),
    }),
    tertiaryFixedDim: DynamicColor.fromPalette({
      name: 'tertiary_fixed_dim',
      palette: (s) => s.tertiaryPalette,
      tone: (s) => (isMonochrome(s) ? 30.0 : 80.0),
      isBackground: true,
      background: (s) => MaterialDynamicColors.highestSurface(s),
      contrastCurve: new ContrastCurve(1, 1, 3, 7),
      toneDeltaPair: (s) =>
        new ToneDeltaPair(
          MaterialDynamicColors.getColor('tertiaryFixed'),
          MaterialDynamicColors.getColor('tertiaryFixedDim'),
          10,
          'lighter',
          true
        ),
    }),
    onTertiaryFixed: DynamicColor.fromPalette({
      name: 'on_tertiary_fixed',
      palette: (s) => s.tertiaryPalette,
      tone: (s) => (isMonochrome(s) ? 100.0 : 10.0),
      background: (s) => MaterialDynamicColors.getColor('tertiaryFixedDim'),
      secondBackground: (s) => MaterialDynamicColors.getColor('tertiaryFixed'),
      contrastCurve: new ContrastCurve(4.5, 7, 11, 21),
    }),
    onTertiaryFixedVariant: DynamicColor.fromPalette({
      name: 'on_tertiary_fixed_variant',
      palette: (s) => s.tertiaryPalette,
      tone: (s) => (isMonochrome(s) ? 90.0 : 30.0),
      background: (s) => MaterialDynamicColors.getColor('tertiaryFixedDim'),
      secondBackground: (s) => MaterialDynamicColors.getColor('tertiaryFixed'),
      contrastCurve: new ContrastCurve(3, 4.5, 7, 11),
    }),
  };

  public static getColor(name: DynamicColorKey) {
    if (this.colorMap[name]) {
      return this.colorMap[name];
    } else {
      throw new Error(`Color ${name} does not exist`);
    }
  }

  public static getColors() {
    return this.colorMap;
  }

  public static setColor(name: DynamicColorKey, dynamicColor: DynamicColor) {
    this.colorMap[name] = dynamicColor;
  }

  static highestSurface(s: DynamicScheme): DynamicColor {
    return s.isDark
      ? MaterialDynamicColors.getColor('surfaceBright')
      : MaterialDynamicColors.getColor('surfaceDim');
  }
}

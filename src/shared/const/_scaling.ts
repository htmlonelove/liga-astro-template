import { DeviceSize } from './_deviceSize'

export type ScalingBreakpoint = {
  size: { min?: number; base: number }
  fontSize: { min?: number; base: number; max?: number }
}

export const BASE_FONT_SIZE = 16

export const SCALING_BREAKPOINTS: ScalingBreakpoint[] = [
  {
    size: { min: DeviceSize.Desktop.SMALL, base: DeviceSize.Desktop.MEDIUM },
    fontSize: { min: 14, base: BASE_FONT_SIZE, max: 16 }
  },
  {
    size: { base: DeviceSize.Tablet.LANDSCAPE },
    fontSize: { base: BASE_FONT_SIZE, max: 18 }
  },
  {
    size: { base: DeviceSize.Tablet.PORTRAIT },
    fontSize: { base: BASE_FONT_SIZE, max: 18 }
  },
  {
    size: { base: DeviceSize.Mobile.MEDIUM },
    fontSize: { min: 14, base: BASE_FONT_SIZE }
  }
]

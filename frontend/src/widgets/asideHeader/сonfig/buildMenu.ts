import { buildGuestMenuItems } from './buildGuestMenuItems'
import { buildAuthMenuItems } from './buildAuthMenuItems'

export const buildMenu = {
  guest: buildGuestMenuItems,
  auth: buildAuthMenuItems,
}

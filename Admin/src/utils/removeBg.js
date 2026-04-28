import { removeBackground } from '@imgly/background-removal'

/**
 * AI-based background removal — free, browser mein chalta hai, subject safe
 * @param {string} imageUrl
 * @returns {Promise<Blob>} transparent PNG blob
 */
export async function removeBg(imageUrl) {
  return await removeBackground(imageUrl)
}

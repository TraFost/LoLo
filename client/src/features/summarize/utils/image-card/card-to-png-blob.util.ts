import type { RefObject } from 'react';
import * as htmlToImage from 'html-to-image';

export async function cardToPngBlob(ref: RefObject<HTMLElement | null>): Promise<Blob> {
  if (!ref.current) {
    throw new Error('Card ref not ready');
  }

  const dataUrl = await htmlToImage.toPng(ref.current, { cacheBust: true });
  const response = await fetch(dataUrl);

  if (!response.ok) {
    throw new Error('Failed to convert card to PNG blob');
  }

  return await response.blob();
}

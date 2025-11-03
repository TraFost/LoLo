import { toPng } from 'html-to-image';

export const downloadToPng = async (ref: React.RefObject<HTMLDivElement | null>, name: string) => {
  if (!ref.current) return;
  const dataUrl = await toPng(ref.current, { cacheBust: true });
  const link = document.createElement('a');
  link.download = `${name}.png`;
  link.href = dataUrl;
  link.click();
};

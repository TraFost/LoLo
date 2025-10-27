import { sleep } from 'shared/src/lib/utils';

export class HeaderRateGate {
  private windows: { cap: number; sec: number }[] = [
    { cap: 20, sec: 1 },
    { cap: 100, sec: 120 },
  ];
  private hits: number[] = [];
  private initialized = false;

  initFrom(headers: { [k: string]: unknown }) {
    if (this.initialized) return;

    const raw = headers['x-method-rate-limit'];
    const lm = typeof raw === 'string' ? raw : String(raw ?? '');
    if (!lm) return;

    const parsed = lm
      .split(',')
      .map((p) => {
        const parts = p.split(':');
        const cap = Number(parts[0]);
        const sec = Number(parts[1]);
        return Number.isFinite(cap) && Number.isFinite(sec) ? { cap, sec } : null;
      })
      .filter((v): v is { cap: number; sec: number } => v !== null)
      .sort((a, b) => a.sec - b.sec);

    if (parsed.length === 0) return;

    this.windows = parsed;
    this.initialized = true;
  }

  async before() {
    for (;;) {
      const now = Date.now();
      const maxSec = this.windows[this.windows.length - 1]!.sec * 1000;
      const cutoff = now - maxSec;
      while (this.hits.length > 0 && this.hits[0]! < cutoff) this.hits.shift();

      let waitMs = 0;
      for (const w of this.windows) {
        const from = now - w.sec * 1000;

        let i = this.hits.length;
        while (i > 0 && this.hits[i - 1]! >= from) i--;
        const used = this.hits.length - i;
        if (used >= w.cap) {
          const earliestIdx = i;
          const earliest = this.hits[earliestIdx]!;
          waitMs = Math.max(waitMs, earliest + w.sec * 1000 - now + 1);
        }
      }
      if (waitMs <= 0) {
        this.hits.push(now);
        return;
      }
      await sleep(waitMs);
    }
  }
  async after(headers: { [k: string]: unknown }) {
    this.initFrom(headers);
    const raVal = headers?.['retry-after'];
    const raStr = typeof raVal === 'string' ? raVal : String(raVal ?? '');
    if (raStr) await sleep(Number(raStr) ? Number(raStr) * 1000 : 500);
  }
}

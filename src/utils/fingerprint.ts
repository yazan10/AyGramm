// Digital fingerprint — captures stable device characteristics without
// any personal data so the platform can recognize a returning device.
export const getDeviceFingerprint = (): string => {
  const parts: string[] = [];

  const nav = typeof navigator !== 'undefined' ? navigator : ({} as Navigator);
  parts.push(nav.userAgent || 'ua');
  parts.push(nav.platform || 'pf');
  parts.push(nav.language || (nav.languages && nav.languages[0]) || 'lang');
  parts.push(String(nav.hardwareConcurrency || 0));
  parts.push(String((nav as any).deviceMemory || 0));
  parts.push(String((nav as any).maxTouchPoints || 0));
  parts.push(String(new Date().getTimezoneOffset()));

  const win = typeof window !== 'undefined' ? window : ({} as Window);
  const scr = win.screen;
  if (scr) {
    parts.push(`${scr.width}x${scr.height}`);
    parts.push(String(scr.colorDepth || 0));
  }

  // Canvas fingerprint (stable per browser/GPU)
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 60;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = "14px 'Arial'";
      ctx.fillStyle = '#0F3D2E';
      ctx.fillRect(0, 0, 240, 60);
      ctx.fillStyle = '#D4AF37';
      ctx.fillText('AyGramFingerprint::' + navigator.vendor + '::', 4, 10);
      ctx.fillText('AyGramDeviceToken', 4, 30);
      parts.push(canvas.toDataURL());
    }
  } catch (e) {
    parts.push('no-canvas');
  }

  // WebGL renderer
  try {
    const gl = document.createElement('canvas').getContext('webgl');
    const dbg = gl && (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
    if (gl && dbg) {
      parts.push(String((gl as WebGLRenderingContext).getParameter(dbg.UNMASKED_RENDERER_WEBGL)));
    }
  } catch (e) {
    /* ignore */
  }

  // Audio context oscillation fingerprint (optional, throttled-friendly)
  try {
    if (typeof window !== 'undefined' && window.OfflineAudioContext) {
      const ctx = new OfflineAudioContext(1, 44100, 44100);
      const osc = ctx.createOscillator();
      const dst = ctx.createDynamicsCompressor();
      osc.connect(dst);
      dst.connect(ctx.destination);
      osc.frequency.value = 12400;
      osc.start(0);
      ctx.startRendering();
      parts.push('audio-node');
    }
  } catch (e) {
    parts.push('no-audio');
  }

  // Simple stable hash
  const raw = parts.join('|');
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < raw.length; i++) {
    const ch = raw.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const pad = (n: number) => (n >>> 0).toString(16).padStart(8, '0');
  return 'FP-' + pad(h1) + '-' + pad(h2) + ':' + (nav.platform ? nav.platform.slice(0, 12) : 'dev').replace(/[^a-z0-9]/gi, '');
};

export const formatFingerprint = (fp: string): string =>
  fp.startsWith('FP-') ? fp.slice(0, 11) + '…' : fp.slice(0, 16) + '…';
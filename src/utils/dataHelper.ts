export function extractList(d: any): any[] {
  if (!d) return [];
  if (Array.isArray(d)) return d;

  if (d.data) {
    if (Array.isArray(d.data)) return d.data;
    if (typeof d.data === 'object') {
      const arrays = Object.values(d.data).filter(v => Array.isArray(v));
      if (arrays.length > 0) return arrays[0] as any[];
    }
  }

  if (typeof d === 'object') {
    const arrays = Object.values(d).filter(v => Array.isArray(v));
    if (arrays.length > 0) return arrays[0] as any[];
  }

  return [];
}

export const config = {
  runtime: 'nodejs',
};

export default function handler(_req: any, res: any) {
  res.setHeader?.('Access-Control-Allow-Origin', '*');
  res.setHeader?.('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.status?.(200).json?.({
    ok: true,
    service: 'AyGram Cloud Storage Engine',
    timestamp: new Date().toISOString(),
  });
}

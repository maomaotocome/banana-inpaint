import { respData, respErr } from '@/shared/lib/resp';

export async function POST(request: Request) {
  try {
    const { eventId, host, apiName } = await request.json();

    if (!eventId || !host || !apiName) {
      return respErr('eventId, host, and apiName are required');
    }

    // Validate host is a legitimate HF Space URL
    const hostUrl = new URL(host);
    if (!hostUrl.hostname.endsWith('.hf.space')) {
      return respErr('invalid host');
    }

    // Fetch SSE stream from Gradio
    const resultResp = await fetch(`${host}/call/${apiName}/${eventId}`);

    if (!resultResp.ok) {
      if (resultResp.status === 404) {
        return respData({ status: 'pending', images: [] });
      }
      throw new Error(`Gradio query failed: ${resultResp.status}`);
    }

    const text = await resultResp.text();

    // Parse SSE text/event-stream format
    // Format: "event: eventname\ndata: json\n\n"
    const lines = text.split('\n');
    let lastEventType = '';
    let resultData: any = null;

    for (const line of lines) {
      if (line.startsWith('event: ')) {
        lastEventType = line.slice(7).trim();
      } else if (line.startsWith('data: ') && lastEventType === 'complete') {
        try {
          resultData = JSON.parse(line.slice(6));
        } catch {
          // ignore parse errors
        }
      } else if (line.startsWith('data: ') && lastEventType === 'error') {
        return respErr(line.slice(6));
      }
    }

    // Check if still processing
    if (!resultData) {
      // Look for heartbeat or progress events
      const hasHeartbeat = lines.some(
        (l) => l.startsWith('event: heartbeat') || l.startsWith('event: generating')
      );
      if (hasHeartbeat) {
        return respData({ status: 'processing', images: [] });
      }
      return respData({ status: 'pending', images: [] });
    }

    // Extract image URLs from Gradio response
    // Gradio returns: [{ url, path, ... }, seed]
    const images: string[] = [];

    if (Array.isArray(resultData)) {
      for (const item of resultData) {
        if (item && typeof item === 'object' && item.url) {
          images.push(item.url);
        } else if (item && typeof item === 'object' && item.path) {
          // Build URL from path for Gradio file serving
          images.push(`${host}/file=${item.path}`);
        }
      }
    }

    return respData({
      status: images.length > 0 ? 'success' : 'processing',
      images,
    });
  } catch (e: any) {
    console.log('free query failed', e);
    return respErr(e.message);
  }
}

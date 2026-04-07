import { respData, respErr } from '@/shared/lib/resp';

// HuggingFace Space ID — change this to switch the underlying model
const HF_SPACE_ID =
  process.env.HF_FREE_IMAGE_SPACE_ID ||
  'luca115/wan2-2-5b-fast-t2v-i2v-t2i';

// Gradio API function name for image generation
const API_NAME = process.env.HF_FREE_IMAGE_API_NAME || 'generate_image';

// Simple in-memory rate limiter: max 3 requests per IP per minute
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 3;
const ipRequests = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = ipRequests.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);

  if (recent.length >= RATE_LIMIT_MAX) {
    ipRequests.set(ip, recent);
    return false;
  }

  recent.push(now);
  ipRequests.set(ip, recent);
  return true;
}

async function resolveSpaceHost(spaceId: string): Promise<string> {
  const resp = await fetch(
    `https://huggingface.co/api/spaces/${spaceId}/host`
  );
  if (!resp.ok) {
    throw new Error(`Failed to resolve HF Space host: ${resp.status}`);
  }
  const data = await resp.json();
  return data.host;
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({
          code: -1,
          message: 'Too many requests. Please wait a moment and try again.',
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return respErr('prompt is required');
    }

    const trimmedPrompt = prompt.trim().slice(0, 2000);

    // 1. Resolve Space host
    const host = await resolveSpaceHost(HF_SPACE_ID);

    // 2. Submit task to Gradio API
    // generate_image inputs: prompt, height, width, negative_prompt,
    //   guidance_scale, inference_steps, seed, randomize_seed
    const submitResp = await fetch(`${host}/call/${API_NAME}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [
          trimmedPrompt, // prompt
          1024, // output_height
          1024, // output_width
          '',   // negative_prompt
          5,    // guidance_scale
          4,    // inference_steps
          0,    // seed
          true, // randomize_seed
        ],
      }),
    });

    if (!submitResp.ok) {
      const text = await submitResp.text();
      throw new Error(`Gradio submit failed: ${submitResp.status} ${text}`);
    }

    const submitData = await submitResp.json();
    const eventId = submitData.event_id;

    if (!eventId) {
      throw new Error('No event_id returned from Gradio');
    }

    return respData({ eventId, host, apiName: API_NAME });
  } catch (e: any) {
    console.log('free generate failed', e);
    return respErr(e.message);
  }
}

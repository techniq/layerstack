import type { RequestHandler } from './$types';
import { generateLlmsTxt } from '$lib/llms';
import { markdownResponse } from '@layerstack/docs/llms';

export const GET: RequestHandler = async ({ url }) => {
  return markdownResponse(generateLlmsTxt(url.origin), 'llms.md');
};

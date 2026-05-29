import type { RequestHandler } from './$types';
import { generateFullLlmsTxt } from '$lib/llms';
import { markdownResponse } from '@layerstack/docs/llms';

export const GET: RequestHandler = async ({ url }) => {
	return markdownResponse(generateFullLlmsTxt(url.origin), 'llms-full.md');
};

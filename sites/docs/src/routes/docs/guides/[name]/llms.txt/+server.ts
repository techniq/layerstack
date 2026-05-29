import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateGuideMarkdown } from '$lib/llms';
import { markdownResponse } from '@layerstack/docs/llms';

export const GET: RequestHandler = async ({ params }) => {
	try {
		return markdownResponse(generateGuideMarkdown(params.name), `${params.name}.md`);
	} catch {
		error(404, 'Not found');
	}
};

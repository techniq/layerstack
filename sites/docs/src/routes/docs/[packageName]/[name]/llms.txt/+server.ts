import { allReferences } from 'content-collections';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateReferenceMarkdown } from '$lib/llms';
import { markdownResponse } from '@layerstack/docs/llms';

/** LLM-optimized markdown for a reference doc (page content + inlined examples). */
export const GET: RequestHandler = async ({ params }) => {
	const slug = `${params.packageName}/${params.name}`;
	const doc = allReferences.find((r) => r.slug === slug);
	if (!doc) {
		error(404, 'Not found');
	}

	return markdownResponse(generateReferenceMarkdown(doc), `${params.name}.md`);
};

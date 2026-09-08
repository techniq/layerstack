import { allComponents } from 'content-collections';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateComponentMarkdown } from '$lib/llms';
import { markdownResponse } from '@layerstack/docs/llms';

/** LLM-optimized markdown for a component doc (page content, inlined examples, and API tables). */
export const GET: RequestHandler = async ({ params }) => {
  const doc = allComponents.find((c) => c.slug === params.name);
  if (!doc) {
    error(404, 'Not found');
  }

  return markdownResponse(generateComponentMarkdown(doc), `${params.name}.md`);
};

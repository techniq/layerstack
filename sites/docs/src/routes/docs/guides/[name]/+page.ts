import { getMarkdownComponent, loadExamplesFromMarkdown } from '$lib/content.js';

export const load = async ({ params }) => {
	const { PageComponent, metadata } = await getMarkdownComponent(params.name, 'guides');
	const examples = await loadExamplesFromMarkdown(metadata.content, undefined, 'guides');

	return { PageComponent, metadata, examples };
};

import { getMarkdownComponent, loadExamplesFromMarkdown } from '$lib/content.js';

export const load = async ({ params }) => {
	const slug = `${params.packageName}/${params.name}`;

	const { PageComponent, metadata } = await getMarkdownComponent(slug, 'reference');

	// Eagerly load any examples referenced by the markdown (`:example{name="..."}`),
	// defaulting the component to the current item name.
	const examples = await loadExamplesFromMarkdown(metadata.content, params.name, 'reference');

	return { PageComponent, metadata, examples };
};

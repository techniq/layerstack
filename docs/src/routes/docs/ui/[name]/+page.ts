import { getMarkdownComponent, loadExamplesFromMarkdown } from '$lib/content.js';

export const load = async ({ params }) => {
  const { PageComponent, metadata } = await getMarkdownComponent(params.name, 'components');

  // Eagerly load any examples referenced by the markdown (`:example{name="..."}`),
  // defaulting the component to the current component name.
  const examples = await loadExamplesFromMarkdown(metadata.content, params.name, 'components');

  return { PageComponent, metadata, examples };
};

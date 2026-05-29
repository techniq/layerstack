import { allReferences } from 'content-collections';
import { error, text } from '@sveltejs/kit';

/** Serve the raw markdown for a reference doc (consumed by `OpenWithButton`'s page/LLM actions). */
export const GET = ({ params }) => {
	const slug = `${params.packageName}/${params.name}`;
	const doc = allReferences.find((r) => r.slug === slug);
	if (!doc) {
		error(404, 'Not found');
	}

	const body = [`# ${doc.title}`, doc.description, doc.content].filter(Boolean).join('\n\n');
	return text(body);
};

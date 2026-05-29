import { json } from '@sveltejs/kit';
import { searchContent } from '$lib/searchContent';

export const prerender = true;

export const GET = async () => {
	return json(searchContent);
};

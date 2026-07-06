import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
	cookies.delete('session_id', { path: '/' });
	return new Response(null, { status: 200 });
};

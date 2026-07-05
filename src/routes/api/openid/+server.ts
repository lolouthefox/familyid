import { token as tokenTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from '../token/$types';
import { db } from '$lib/server/db';

export const GET: RequestHandler = async ({ request }) => {
	const authHeader = request.headers.get('Authorization');
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		throw new Error('Invalid authorization header');
	}
	const token = authHeader.split(' ')[1];
	const tokenData = await db.select().from(tokenTable).where(eq(tokenTable.id, token));
	if (tokenData.length === 0) {
		throw new Error('Invalid token');
	}
	const { scope } = tokenData[0];
	if (!scope) {
		throw new Error('Invalid scope');
	}
	const scopeList = scope.split(',');
	if (scopeList.length === 0) {
		throw new Error('Invalid scope');
	}
	if (!scopeList.includes('openid')) {
		throw new Error('Invalid scope');
	}
	return Response.json({ userId: tokenData[0].userId });
};

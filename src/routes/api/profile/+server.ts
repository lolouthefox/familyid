import { token as tokenTable, user as userTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from '../token/$types';
import { db } from '$lib/server/db';

export const POST: RequestHandler = async ({ request }) => {
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
	if (!scopeList.includes('profile')) {
		throw new Error('Invalid scope');
	}
	const users = await db
		.select({
			id: userTable.id,
			username: userTable.username,
			role: userTable.role
		})
		.from(userTable)
		.where(eq(userTable.id, tokenData[0].userId));
	if (users.length === 0) {
		throw new Error('Invalid user');
	}
	return Response.json({ profile: users[0] });
};

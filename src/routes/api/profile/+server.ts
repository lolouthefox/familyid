import {
	token as tokenTable,
	user as userTable,
	session as sessionTable
} from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from '../token/$types';
import { db } from '$lib/server/db';
import argon2 from 'argon2';

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

async function checkAuthType(request: Request): Promise<'bearer' | 'session'> {
	const authHeader = request.headers.get('Authorization');
	if (!authHeader) {
		return 'session';
	}
	if (authHeader.startsWith('Bearer ')) {
		return 'bearer';
	}
	throw new Error('Invalid authorization header');
}

async function checkAuth(request: Request) {
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

	return tokenData[0];
}

async function getUserFromTokenData(tokenData: Awaited<ReturnType<typeof checkAuth>>) {
	const users = await db
		.select({
			id: userTable.id,
			username: userTable.username,
			role: userTable.role,
			profilePicture: userTable.profilePicture
		})
		.from(userTable)
		.where(eq(userTable.id, tokenData.userId));
	if (users.length === 0) {
		throw new Error('Invalid user');
	}
	return users[0];
}

async function getUserFromSession(sessionId: string) {
	const sessions = await db
		.select()
		.from(sessionTable)
		.where(eq(sessionTable.id, sessionId))
		.leftJoin(userTable, eq(sessionTable.userId, userTable.id));
	if (sessions.length === 0) {
		throw new Error('Invalid session');
	}
	const user = sessions[0].user;
	if (!user) {
		throw new Error('Invalid user');
	}
	return user;
}

export const PUT: RequestHandler = async ({ request, cookies }) => {
	const { pfp, username, password } = await request.json();
	const authType = await checkAuthType(request);

	let userID: string | undefined;
	if (authType === 'bearer') {
		const tokenData = await checkAuth(request);
		const user = await getUserFromTokenData(tokenData);
		userID = user.id;
	}
	if (authType === 'session') {
		const sessionId = cookies.get('session_id');
		if (!sessionId) {
			throw new Error('No session ID');
		}
		const user = await getUserFromSession(sessionId);
		userID = user.id;
	}

	if (!userID) {
		throw new Error('Invalid user');
	}

	if (username) {
		await db.update(userTable).set({ username: username }).where(eq(userTable.id, userID));
	}

	if (pfp) {
		await db.update(userTable).set({ profilePicture: pfp }).where(eq(userTable.id, userID));
	}

	// Only allow password updates through official website
	if (password && authType === 'session') {
		const passwordHash = await argon2.hash(password);
		await db.update(userTable).set({ passwordHash: passwordHash }).where(eq(userTable.id, userID));
	}

	return new Response('OK', { status: 200 });
};

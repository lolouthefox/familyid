import { db } from '$lib/server/db/index.js';
import { session, user as usersTable } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import argon2 from 'argon2';
import { redirect } from '@sveltejs/kit';

export const actions = {
	login: async ({ request, cookies }) => {
		const formData = await request.formData();
		const username = formData.get('username') as string;
		const password = formData.get('password') as string;
		const redirectUrl = formData.get('redirect_uri') as string;

		if (!username || !password) {
			return { error: 'Username and password are required' };
		}

		const users = await db.select().from(usersTable).where(eq(usersTable.username, username));
		if (users.length === 0) {
			return { error: 'Invalid username or password' };
		}
		const user = users[0];

		try {
			const isValid = await argon2.verify(user.passwordHash, password);
			if (!isValid) {
				return { error: 'Invalid username or password' };
			}
		} catch {
			return { error: 'Invalid username or password' };
		}

		const sessionId = await createSession(user.id);
		cookies.set('session_id', sessionId, {
			path: '/',
			sameSite: 'lax',
			secure: false
		});

		redirect(307, redirectUrl);
	},
	register: async ({ request, cookies }) => {
		const formData = await request.formData();
		const username = formData.get('username') as string;
		const password = formData.get('password') as string;
		const redirectUrl = formData.get('redirect_uri') as string;

		if (!username || !password) {
			return { error: 'Username and password are required' };
		}

		const users = await db.select().from(usersTable).where(eq(usersTable.username, username));
		if (users.length > 0) {
			return { error: 'Username already exists' };
		}

		const hashedPassword = await argon2.hash(password);
		const id = crypto.randomUUID();
		await db.insert(usersTable).values({ id, username, passwordHash: hashedPassword });

		const sessionId = await createSession(id);
		cookies.set('session_id', sessionId, {
			path: '/'
		});

		redirect(307, redirectUrl);
	}
};

async function createSession(userId: string) {
	const sessionId = crypto.randomUUID();
	const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
	const sessions = await db
		.insert(session)
		.values({ id: sessionId, userId, expiresAt })
		.returning();
	if (sessions.length === 0) {
		throw new Error('Failed to create session');
	}
	return sessionId;
}

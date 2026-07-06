import { db } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import { session as sessionTable } from '$lib/server/db/schema';
import { user as userTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async ({ cookies }) => {
	const sessionId = cookies.get('session_id');
	if (!sessionId) {
		return redirect(307, '/auth?redirect_uri=' + encodeURIComponent('/'));
	}
	const sessions = await db
		.select()
		.from(sessionTable)
		.where(eq(sessionTable.id, sessionId))
		.leftJoin(userTable, eq(sessionTable.userId, userTable.id));
	if (sessions.length === 0) {
		return redirect(307, '/auth?redirect_uri=' + encodeURIComponent('/'));
	}
	const session = sessions[0];
	if (!session) {
		return redirect(307, '/auth?redirect_uri=' + encodeURIComponent('/'));
	}
	if (!session.user) {
		return redirect(307, '/auth?redirect_uri=' + encodeURIComponent('/'));
	}

	return { user: session.user };
};

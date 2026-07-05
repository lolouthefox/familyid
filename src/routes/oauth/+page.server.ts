import { db } from '$lib/server/db';
import {
	application,
	session as sessionTable,
	user as userTable,
	code as codeTable
} from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

const ALLOWED_SCOPES = ['openid', 'profile'];

export const load = async ({ url, cookies }) => {
	const sessionId = cookies.get('session_id');
	if (!sessionId) {
		return redirect(307, '/auth?redirect_uri=' + encodeURIComponent(url.toString()));
	}
	const sessions = await db
		.select()
		.from(sessionTable)
		.where(eq(sessionTable.id, sessionId))
		.leftJoin(userTable, eq(sessionTable.userId, userTable.id));
	if (sessions.length === 0) {
		return redirect(307, '/auth?redirect_uri=' + encodeURIComponent(url.toString()));
	}
	const session = sessions[0];
	if (!session) {
		return redirect(307, '/auth?redirect_uri=' + encodeURIComponent(url.toString()));
	}

	const params = new URL(url).searchParams;
	const appId = params.get('app_id');
	const redirectUri = params.get('redirect_uri');
	const scope = params.get('scope');
	const response_type = params.get('response_type');
	const state = params.get('state');

	const missing = [];

	if (!appId) {
		missing.push('app_id');
	}
	if (!redirectUri) {
		missing.push('redirect_uri');
	}
	if (!scope) {
		missing.push('scope');
	}
	if (!response_type) {
		missing.push('response_type');
	}

	if (!appId || !redirectUri || !scope || !response_type) {
		return { error: `Missing ${missing.join(', ')} parameter${missing.length > 1 ? 's' : ''}.` };
	}

	if (response_type !== 'code') {
		return { error: 'Invalid response_type. Only "code" is supported.' };
	}

	const scopes = scope.split(',');

	if (!scopes.every((s) => ALLOWED_SCOPES.includes(s))) {
		return { error: `Invalid scope. Only ${ALLOWED_SCOPES.join(', ')} are supported.` };
	}

	const apps = await db
		.select({ id: application.id, name: application.name, iconUrl: application.iconUrl })
		.from(application)
		.where(and(eq(application.id, appId), eq(application.redirectUri, redirectUri)));

	if (apps.length === 0) {
		return { error: 'Invalid app_id or redirect_uri.' };
	}
	const app = apps[0];

	return { app, scopes, state };
};

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const appId = data.get('app_id') as string;
		const redirectUri = data.get('redirect_uri') as string;
		const scope = data.get('scope') as string;
		const response_type = data.get('response_type') as string;
		const state = data.get('state') as string;

		const missing = [];
		if (!appId) missing.push('app_id');
		if (!redirectUri) missing.push('redirect_uri');
		if (!scope) missing.push('scope');
		if (!response_type) missing.push('response_type');
		if (!appId || !redirectUri || !scope || !response_type) {
			return { error: `Missing ${missing.join(', ')} parameter${missing.length > 1 ? 's' : ''}.` };
		}

		if (response_type !== 'code') {
			return { error: 'Invalid response_type. Only "code" is supported.' };
		}
		const scopes = scope.split(',');
		if (!scopes.every((s) => ALLOWED_SCOPES.includes(s))) {
			return { error: `Invalid scope. Only ${ALLOWED_SCOPES.join(', ')} are supported.` };
		}
		const apps = await db
			.select({ id: application.id, name: application.name, iconUrl: application.iconUrl })
			.from(application)
			.where(and(eq(application.id, appId), eq(application.redirectUri, redirectUri)));
		if (apps.length === 0) {
			return { error: 'Invalid app_id or redirect_uri.' };
		}

		// Check if the user is properly authenticated
		const sessionId = cookies.get('session_id');
		if (!sessionId) {
			return { error: 'User not authenticated.' };
		}
		const session = await db
			.select({ userId: sessionTable.userId })
			.from(sessionTable)
			.where(eq(sessionTable.id, sessionId));
		if (session.length === 0) {
			return { error: 'Invalid session.' };
		}
		const userId = session[0].userId;

		// Create the authorization code
		const code = crypto.randomUUID();
		const expiresAt = new Date(Date.now() + 300000).toISOString(); // 5 minutes
		const codeDb = await db
			.insert(codeTable)
			.values({ id: code, applicationId: appId, scope, userId, expiresAt })
			.returning();
		const insertedCode = codeDb[0].id;

		const newUrl = new URL(redirectUri);
		newUrl.searchParams.set('code', insertedCode);
		newUrl.searchParams.set('state', state);
		return { redirectNow: newUrl.toString() };
	}
};

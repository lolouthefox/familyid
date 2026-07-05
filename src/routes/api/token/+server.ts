import { db } from '$lib/server/db';
import { code as codeTable, token as tokenTable } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { grant_type, code, redirect_uri } = await request.json();
	if (!grant_type || !code || !redirect_uri) {
		throw new Error('Missing required parameters');
	}
	if (grant_type !== 'authorization_code') {
		throw new Error('Invalid grant type');
	}

	// Check and code against the database
	const codes = await db
		.select()
		.from(codeTable)
		.where(and(eq(codeTable.id, code), eq(codeTable.redirectUri, redirect_uri)));
	if (codes.length === 0) {
		throw new Error('Invalid code');
	}
	const { applicationId, userId, scope } = codes[0];

	// Delete the code from the database
	await db.delete(codeTable).where(eq(codeTable.id, code));

	// Generate a new access token
	const access_token = crypto.randomUUID();
	const refresh_token = crypto.randomUUID();
	const expiresAt = new Date(Date.now() + 3600000).toISOString();
	const accessToken = await db
		.insert(tokenTable)
		.values({
			id: access_token,
			refreshToken: refresh_token,
			expiresAt,
			applicationId,
			userId,
			scope
		})
		.returning();
	if (accessToken.length === 0) {
		throw new Error('Failed to generate access token');
	}

	return Response.json({ access_token, token_type: 'Bearer', expires_in: 3600, refresh_token });
};

import { sql } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	role: text('role').notNull().default('user'),
	profilePicture: text('profile_picture').default(
		'https://familyid.liam-cheneval.dev/pfp/familyid/1.png'
	)
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	expiresAt: text('expires_at').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' })
});

export const application = pgTable('application', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	secret: text('secret').notNull(),
	redirectUri: text('redirect_uri').notNull(),
	iconUrl: text('icon_url').notNull()
});

export const code = pgTable('code', {
	id: text('id').primaryKey(),
	expiresAt: text('expires_at').notNull(),
	scope: text('scope').notNull(),
	applicationId: text('application_id')
		.notNull()
		.references(() => application.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	redirectUri: text('redirect_uri').notNull()
});

export const token = pgTable('token', {
	id: text('id').primaryKey(),
	refreshToken: text('refresh_token').notNull(),
	expiresAt: text('expires_at').notNull(),
	scope: text('scope').notNull(),
	applicationId: text('application_id')
		.notNull()
		.references(() => application.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' })
});

import { error, type RequestEvent } from '@sveltejs/kit';
import type { SessionUser } from './types';

export const requireAdmin = (event: RequestEvent): SessionUser => {
	const user = event.locals.user;

	if (!user?.isAdmin) {
		throw error(403, 'Admin access required.');
	}

	return user;
};


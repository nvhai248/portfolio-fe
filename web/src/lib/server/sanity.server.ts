import { env as privateEnv } from '$env/dynamic/private';
import { createClient } from '@sanity/client';

const projectId = '25my9hca';
const dataset = 'production';
const apiVersion = '2025-04-01';

const readToken = privateEnv.SANITY_API_READ_TOKEN?.trim();

export const serverSanityClient = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: !readToken,
	token: readToken || undefined
});

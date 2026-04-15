import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

export const client = createClient({
	projectId: '25my9hca',
	dataset: 'production',
	apiVersion: '2025-04-01',
	useCdn: true
});

const builder = createImageUrlBuilder(client);

export function urlFor(source: any) {
	return builder.image(source);
}

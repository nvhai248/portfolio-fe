import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
    projectId: '25my9hca',
    dataset: 'production',
    apiVersion: '2024-03-12', // Use current date
    useCdn: false, // Turn off CDN for real-time updates during dev
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
    return builder.image(source);
}

import { createClient } from '@sanity/client';

export const client = createClient({
	projectId: '25my9hca',
	dataset: 'production',
	apiVersion: '2025-04-01',
	useCdn: false
});

const BLOG_POSTS_QUERY = `*[_type == "project"]`;

async function test() {
    console.log("Starting fetch...");
    try {
        const result = await client.fetch(BLOG_POSTS_QUERY);
        console.log("Success:", JSON.stringify(result, null, 2));
    } catch (e: any) {
        console.error("Error:", e.message);
    }
}

test();

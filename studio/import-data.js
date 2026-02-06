import { createClient } from 'next-sanity' // Or just 'sanity' if running in studio context, but we use sanity exec so 'part:@sanity/base/client' is old.
// In v3 studio, we can use the client from 'sanity/cli' or just standalone.
// Better: standalone script using 'sanity' package.

// We will run this with `sanity exec import-data.js --with-user-token`

const client = {
    createOrReplace: async (doc) => {
        console.log('Dry run createOrReplace:', doc._id);
    }
};
// Wait, I cannot mock the client easily in a standalone file without proper setup.
// I will expect to run this with `sanity exec`.
// Actually, `sanity exec` injects `sanity` global or allows importing configured client?
// In v3, `sanity exec` runs the script.
// Let's rely on `getCliClient` from 'sanity/cli' ? No, that's internal.

// Standard way: use `import {getCliClient} from 'sanity/cli'` is not public API.
// Simplest: just use the `sanity` client library and assume environment variables or local config.
// Or, generate a NDJSON file and use `sanity dataset import`. This is much safer and robust.

// Plan: Generate `mock-data.ndjson`

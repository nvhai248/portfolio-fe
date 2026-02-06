import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '25my9hca',
    dataset: 'production'
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  }
})

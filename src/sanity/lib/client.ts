import { createClient } from 'next-sanity'

import { apiVersion, dataset,token, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  token, // Get your API token from the Sanity dashboard
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
})

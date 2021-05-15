import { CollectionModel } from '../types/CollectionModel'
import { apiEndpoint } from '../config'
import { CollectionUploadInfo } from '../types/CollectionUploadInfo'

export async function getCollections(idToken: string): Promise<CollectionModel[]> {
  console.log('Fetching Collections')

  const response = await fetch(`${apiEndpoint}/collections`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  const result = await response.json()

  return result.items
}

export async function getCollection(CollectionId: string, idToken: string): Promise<CollectionModel> {
  console.log('Fetching Collections')

  const response = await fetch(`${apiEndpoint}/collections/${CollectionId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  const result = await response.json()
  console.log(JSON.stringify(result))

  return result.collection
}

export async function createCollection(
  idToken: string,
  newCollection: CollectionUploadInfo
): Promise<CollectionModel> {
  const reply = await fetch(`${apiEndpoint}/collections`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
    body: JSON.stringify({
      name: newCollection.name,
      description: newCollection.description
    })
  })
  const result = await reply.json()
  return result.newItem
}

export async function deleteCollection(CollectionId: string, idToken: string): Promise<void> {
  console.log('Deleting Collection')

  await fetch(`${apiEndpoint}/collections/${CollectionId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
}
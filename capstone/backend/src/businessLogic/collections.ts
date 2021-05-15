import * as uuid from 'uuid'

import { Collection } from '../models/Collection'
import { Image } from '../models/Image'
import { CollectionAccess } from '../dataLayer/CollectionsAccess'
import { CreateCollectionRequest } from '../requests/CreateCollectionRequest'
import { getUserId } from '../auth/utils'
import { getImages, deleteImage } from './images'

import { createLogger } from '../utils/logger'

const logger = createLogger('auth0Authorizer-function')


const collectionAccess = new CollectionAccess()

export async function getCollections(jwtToken: string): Promise<Collection[]> {
  const userId = getUserId(jwtToken)
  return collectionAccess.getCollections(userId)
}

export async function createCollection(
  createCollectionRequest: CreateCollectionRequest,
  jwtToken: string
): Promise<Collection> {

  const itemId = uuid.v4()
  const userId = getUserId(jwtToken)

  return await collectionAccess.createCollection({
    id: itemId,
    userId: userId,
    name: createCollectionRequest.name,
    description: createCollectionRequest.description,
    private: createCollectionRequest.private,
    timestamp: new Date().toISOString()
  })
}

export async function collectionExists(
  collectionId: string,
  jwtToken: string
): Promise<boolean> {
  const userId = getUserId(jwtToken)
  return await collectionAccess.CollectionExists(
    userId,
    collectionId
  )
}

export async function getCollection(
  collectionId: string,
  jwtToken: string
): Promise<Collection> {
  const userId = getUserId(jwtToken)
  return await collectionAccess.getCollection(
    userId,
    collectionId
  )
}

export async function deleteCollection(
  collectionId: string,
  jwtToken: string
): Promise<void> {
  const userId = getUserId(jwtToken)
  const images = await getImages(collectionId);
  logger.info('images', images)
  images.map(async (image: Image) => deleteImage(image))

  await collectionAccess.deleteCollection(
    userId,
    collectionId
  )
}
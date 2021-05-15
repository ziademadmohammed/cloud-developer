import * as uuid from 'uuid'

import { Image } from '../models/Image'
import { ImagesAccess } from '../dataLayer/imagesAccess'
import { CreateImageRequest } from '../requests/CreateImageRequest'
import { getUserId } from '../auth/utils'

const bucketName = process.env.IMAGES_S3_BUCKET

const imagesAccess = new ImagesAccess()

export async function createImage(
  createImageRequest: CreateImageRequest,
  collectionId: string,
  jwtToken: string
): Promise<Image> {

  const imageId = uuid.v4()
  const userId = getUserId(jwtToken)

  return await imagesAccess.createImage({
    collectionId: collectionId,
    userId: userId,
    timestamp: new Date().toISOString(),
    imageId: imageId,
    title: createImageRequest.title,
    imageUrl: `https://${bucketName}.s3.amazonaws.com/${imageId}`
  })
}

export function getUploadUrl(imageId: string) {
  return imagesAccess.getUploadUrl(imageId)
}


export async function getImages(collectionId: string): Promise<Image[]> {
  return imagesAccess.getImages(collectionId)
}

export async function getImage(collectionId: string): Promise<Image> {
  return imagesAccess.getImage(collectionId)
}

export async function deleteImage(image: Image) {
  return imagesAccess.deleteImage(image)
}

export async function getAllImages(): Promise<Image[]> {
  return imagesAccess.getAllImages()
}

export async function saveImage(image: Image, jwtToken: string): Promise<Image> {
  const userId = getUserId(jwtToken)
  const imageId = uuid.v4()

  return imagesAccess.createImage({
    collectionId: userId,
    userId: image.userId,
    timestamp: new Date().toISOString(),
    imageId: imageId,
    title: image.title,
    imageUrl: image.imageUrl,
    isSaved: true
  })
}
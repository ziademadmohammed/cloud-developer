import { apiEndpoint } from '../config'
import { ImageModel } from '../types/ImageModel'
import { ImageUploadInfo } from '../types/ImageUploadInfo'
import { ImageUploadResponse } from '../types/ImageUploadResponse'

export async function getImages(CollectionId: string, idToken: string): Promise<ImageModel[]> {
  console.log('Fetching images')

  const response = await fetch(`${apiEndpoint}/collections/${CollectionId}/images`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  const result = await response.json()

  return result.items
}

export async function getAllImages(idToken: string): Promise<ImageModel[]> {
  console.log('Fetching all images')

  const response = await fetch(`${apiEndpoint}/images`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  const result = await response.json()

  return result.items
}

export async function createImage(
  idToken: string,
  newImage: ImageUploadInfo
): Promise<ImageUploadResponse> {

  const reply = await fetch(
    `${apiEndpoint}/collections/${newImage.CollectionId}/images`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({
        title: newImage.title
      })
    }
  )

  return await reply.json()
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await fetch(uploadUrl, {
    method: 'PUT',
    body: file
  })
}

export async function deleteImage(imageId: string, idToken: string): Promise<void> {
  console.log('Deleting image')

  await fetch(`${apiEndpoint}/images/${imageId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
}

export async function saveImage(imageId: string, idToken: string): Promise<ImageUploadResponse> {
  console.log('saveing image')

  const reply = await fetch(`${apiEndpoint}/images/${imageId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })

  return await reply.json()
}

export async function getSaved(idToken: string): Promise<ImageModel[]> {
  console.log('Fetching saved')

  const response = await fetch(`${apiEndpoint}/saved`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  const result = await response.json()

  return result.items
}

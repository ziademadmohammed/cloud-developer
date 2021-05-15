import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'

import { CreateImageRequest } from '../../requests/CreateImageRequest'
import { collectionExists as collectionExists } from '../../businessLogic/collections'
import { createImage, getUploadUrl } from '../../businessLogic/images'
import { createLogger } from '../../utils/logger'

const logger = createLogger('auth0Authorizer-function')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Caller event', event)

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const collectionId = event.pathParameters.collectionId
  const validCollectionId = await collectionExists(collectionId, jwtToken)

  if (!validCollectionId) {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        error: 'Collection not found'
      })
    }
  }

  const newImage: CreateImageRequest = JSON.parse(event.body)
  const newItem = await createImage(newImage, collectionId, jwtToken)

  const url = getUploadUrl(newItem.imageId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      newItem: newItem,
      uploadUrl: url
    })
  }
}

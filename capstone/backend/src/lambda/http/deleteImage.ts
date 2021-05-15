import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteImage, getImage } from '../../businessLogic/images'
import { getUserId } from '../../auth/utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('auth0Authorizer-function')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Caller event', event)
  const imageId = event.pathParameters.imageId

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const userId = getUserId(jwtToken)

  const image = await getImage(imageId)

  if (!image || image.userId !== userId) {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        error: 'Image not found'
      })
    }
  }

  try {
    await deleteImage(image)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: 'Deleted'
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: 'Failed to delete',
    }
  }
}

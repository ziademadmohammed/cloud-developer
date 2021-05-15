import 'source-map-support/register'
import { getImages } from '../../businessLogic/images'
import { collectionExists } from '../../businessLogic/collections'


import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
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
        error: 'collection not found'
      })
    }
  }

  const images = await getImages(collectionId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items: images
    })
  }
}

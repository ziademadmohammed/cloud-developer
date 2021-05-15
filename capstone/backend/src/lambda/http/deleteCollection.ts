import 'source-map-support/register'
import { getCollection, deleteCollection } from '../../businessLogic/collections'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'

const logger = createLogger('auth0Authorizer-function')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Caller event', event)
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const collectionId = event.pathParameters.collectionId
  const collection = await getCollection(collectionId, jwtToken)

  if (!collection) {
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

  try {
    await deleteCollection(collectionId, jwtToken)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: 'Deleted'
    }
  } catch (err) {
    logger.info('Failed to delete', err)
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

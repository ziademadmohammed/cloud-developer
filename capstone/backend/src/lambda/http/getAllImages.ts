import 'source-map-support/register'
import { getAllImages } from '../../businessLogic/images'


import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'

const logger = createLogger('auth0Authorizer-function')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Caller event', event)

  const images = await getAllImages()

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

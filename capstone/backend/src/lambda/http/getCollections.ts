import 'source-map-support/register'
import { getCollections } from '../../businessLogic/collections'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'

const logger = createLogger('auth0Authorizer-function')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Caller event', event)
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const Collections = await getCollections(jwtToken);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
        items: Collections,
    }),
  }
}

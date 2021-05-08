import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { deleteTodo } from '../../businessLogic/todos'

const logger = createLogger('delete-todo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.debug("delete todo event", {event})
  const todoId = event.pathParameters.todoId
  if (!todoId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing todoId' })
    }
  }

  const userId = getUserId(event)
  logger.info("Deleting todo for user", {userId, todoId})

  await deleteTodo(todoId, userId)

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({})
  }
}

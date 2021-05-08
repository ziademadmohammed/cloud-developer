import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { updateTodo } from '../../businessLogic/todos'

const logger = createLogger('update-todo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedProperties: UpdateTodoRequest = JSON.parse(event.body)

  logger.info("update todo event", { updatedProperties })

  if (!todoId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing todoId' })
    }
  }

  const userId = getUserId(event)
  logger.info("Updating a todo of user", { userId, todoId })

  await updateTodo(todoId, userId, updatedProperties)

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({})
  }
}

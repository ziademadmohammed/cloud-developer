import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'

import { getSignedUrl, updateAttachmentUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'

const logger = createLogger('generate-upload-url-todo')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.debug("generateUploadUrl event", { event })
  const todoId = event.pathParameters.todoId

  if (!todoId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'todoId is required' })
    }
  }

  const userId = getUserId(event)

  const signedUrl: string = await getSignedUrl(todoId)
  logger.info("signed URL for todo", { signedUrl })

  await updateAttachmentUrl(signedUrl, todoId, userId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl: signedUrl
    })
  }
}


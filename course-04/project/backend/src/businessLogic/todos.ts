import { TodoItem } from '../models/TodoItem'
import { TodosDao } from '../dataLayer/todosAccess'
import { ImagesDao } from '../dataLayer/imagesAccess'
import { createLogger } from '../utils/logger'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import * as uuid from 'uuid'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const logger = createLogger('todo-business')
const todoDao = new TodosDao()
const imagesDao = new ImagesDao()

export async function getTodos(userId: string): Promise<TodoItem[]> {
    return await todoDao.getTodos(userId)
}

export async function createTodo(newTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem> {
    const todoId = uuid.v4()
    logger.info('Create TODO with generated uuid', { todoId })

    const newTodoItem: TodoItem = {
        userId,
        todoId,
        createdAt: new Date().toISOString(),
        ...newTodoRequest,
        done: false
    }


    return await todoDao.createTodo(newTodoItem)
}

export async function deleteTodo(todoId: string, userId: string) {
    return await todoDao.deleteTodo(todoId, userId)
}

export async function updateTodo(todoId: string, userId: string, updatedProperties: UpdateTodoRequest) {
    return await todoDao.updateTodo(todoId, userId, updatedProperties)
}

export async function getSignedUrl(todoId: string): Promise<string> {
    return await imagesDao.getSignedUrl(todoId)
}

export async function updateAttachmentUrl(signedUrl: string, todoId: string, userId: string) {
    // the first part of the signed url is the attachment url
    const attachmentUrl: string = signedUrl.split("?")[0]
    logger.info("attachment url", {attachmentUrl})
    return await todoDao.updateAttachmentUrl(attachmentUrl, todoId, userId)
}
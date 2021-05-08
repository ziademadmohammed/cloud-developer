import { TodoItem } from '../models/TodoItem'
import { Todos } from '../dataLayer/todosAccess'
import { Images } from '../dataLayer/imagesAccess'
import { createLogger } from '../utils/logger'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import * as uuid from 'uuid'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const logger = createLogger('todo-business')
const todo = new Todos()
const images = new Images()

export async function getTodos(userId: string): Promise<TodoItem[]> {
    return await todo.getTodos(userId)
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


    return await todo.createTodo(newTodoItem)
}

export async function deleteTodo(todoId: string, userId: string) {
    return await todo.deleteTodo(todoId, userId)
}

export async function updateTodo(todoId: string, userId: string, updatedProperties: UpdateTodoRequest) {
    return await todo.updateTodo(todoId, userId, updatedProperties)
}

export async function getSignedUrl(todoId: string): Promise<string> {
    return await images.getSignedUrl(todoId)
}

export async function updateAttachmentUrl(signedUrl: string, todoId: string, userId: string) {
    // the first part of the signed url is the attachment url
    const attachmentUrl: string = signedUrl.split("?")[0]
    logger.info("attachment url", {attachmentUrl})
    return await todo.updateAttachmentUrl(attachmentUrl, todoId, userId)
}
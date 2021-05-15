import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'

const logger = createLogger('auth0Authorizer-function')


const XAWS = AWSXRay.captureAWS(AWS)

import { Collection } from '../models/Collection'

export class CollectionAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly collectionsTable = process.env.COLLECTIONS_TABLE) {
  }

  async getCollections(userId: string): Promise<Collection[]> {
    logger.info('Getting collections')
    const result = await this.docClient.query({
      TableName: this.collectionsTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise()

    const items = result.Items
    return items as Collection[]
  }

  async CollectionExists(userId: string, collectionId: string): Promise<boolean> {
    const params = {
      TableName: this.collectionsTable,
      Key: {
        id: collectionId,
        userId: userId
      }
    }
    const result = await this.docClient.get(params).promise()

    return !!result.Item
  }

  async getCollection(userId: string, collectionId: string): Promise<Collection> {
    const params = {
      TableName: this.collectionsTable,
      Key: {
        id: collectionId,
        userId: userId
      }
    }
    const result = await this.docClient.get(params).promise()

    return result.Item as Collection
  }


  async createCollection(collection: Collection): Promise<Collection> {
    await this.docClient.put({
      TableName: this.collectionsTable,
      Item: collection
    }).promise()

    return collection
  }

  async deleteCollection(userId: string, collectionId: string): Promise<void> {
    await this.docClient.delete({
      TableName: this.collectionsTable,
      Key: {
        id: collectionId,
        userId: userId
      }
    }).promise()
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    logger.info('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
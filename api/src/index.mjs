import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { createItem, getItems, updateItem, getItemsByUserId, getItemById } from './utils.mjs'

const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

export const handler = async (event, context) => {
 
  try {
    const ip = event?.requestContext?.http?.sourceIp ?? null
    const method = event?.requestContext?.http?.method ?? null
    const path = event?.requestContext?.http?.path.replace('/', '') ?? null
    const body = event?.body ? JSON.parse(event?.body) : null
    const searchParams = event?.queryStringParameters ?? {}

    const functionMap = {
      'GET-': getItems,
      'GET-userId': getItemsByUserId,
      'GET-id': getItemById,
      'POST-': createItem,
      'PUT-': updateItem,
    }

    const searchKeys = Object.keys(searchParams).join('-')
    const params = {method, path, searchParams, ip, dynamoDb, body};
    const functionKey = `${method}-${searchKeys}`

    if (functionMap[functionKey]) {
      return functionMap[functionKey](params)
    }

    return {
      statusCode: 400,
      body: JSON.stringify({error: 'Invalid method or path prodvided'}),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({error}),
    };
  }
};

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { createItem, getItems, updateItem } from './utils.mjs'

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
      'GET': getItems,
      'POST': createItem,
      'PUT': updateItem,
    }
  
    const params = {method, path, searchParams, ip, dynamoDb, body};
  
    if (functionMap[method]) {
      return functionMap[method](params)
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

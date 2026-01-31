import {
  Context,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import {
  getItems,
  getItemsByUserId,
  getItemsByGameId,
  getItemById,
  createItem,
  updateItem,
  returnOptionsResponse,
  deleteItemById,
} from './utils';

const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    const path = event.path.replace(/^\//, ''); // Remove leading slash
    const method = `${event.httpMethod}`.toLocaleLowerCase(); // Get HTTP method
    const headers = event.headers || {};
    const token = headers['x-access-token'] || null;
    const body = event?.body ? JSON.parse(event?.body) : null;
    const searchParams = event?.queryStringParameters ?? {};
    const searchKeys = Object.keys(searchParams).join('-');
    const requestKey = `${path}_${method}${
      searchKeys.length ? '_' : ''
    }${searchKeys}`;

    const params = {
      method,
      path,
      searchParams,
      dynamoDb,
      body,
      requestKey,
      token,
    };

    const functionMap: { [key: string]: Function } = {
      games_get: getItems,
      games_get_userId: getItemsByUserId,
      games_get_id: getItemById,
      users_get_id: getItemById,
      users_post: createItem,
      users_options: returnOptionsResponse,
      games_post: createItem,
      games_put: updateItem,
      games_options: returnOptionsResponse,
      versions_options: returnOptionsResponse,
      versions_options_id: returnOptionsResponse,
      versions_get_gameId: getItemsByGameId,
      versions_get_id: getItemById,
      versions_post: createItem,
      versions_delete_id: deleteItemById,
    };
    if (functionMap[requestKey]) {
      return functionMap[requestKey](params);
    }
    console.error(`Invalid request: ${requestKey} not found in functionMap`);
    return {
      statusCode: 400,
      body: `Invalid method or path provided. Please check your request: ${requestKey}`,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error }),
    };
  }
};

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import {
  getItems,
  getItemsByUserId,
  getItemById,
  createItem,
  getOptionsResponse,
} from "./utils.mjs";

const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

export const handler = async (event, context) => {
  try {
    const path = event.path.replace(/^\//, ""); // Remove leading slash
    const method = `${event.httpMethod}`.toLocaleLowerCase(); // Get HTTP method
    const headers = event.headers || {};
    const token = headers["x-access-token"] || null;
    const body = event?.body ? JSON.parse(event?.body) : null;
    const searchParams = event?.queryStringParameters ?? {};
    const searchKeys = Object.keys(searchParams).join("-");
    const requestKey = `${path}_${method}${
      searchKeys.length ? "_" : ""
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

    const functionMap = {
      games_get: getItems,
      // games_get_userId: getItemsByUserId,
      games_get_id: getItemById,

      // users_get: getItems,
      users_get_id: getItemById,
      users_post: createItem,
      users_options: () => {
        return {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, X-Access-Token",
          },
          body: JSON.stringify({ message: "CORS preflight response" }),
        };
      },
      // getOptionsResponse,
      // games_post: createItem,
      // "POST-": createItem,
      // "PUT-": updateItem,
    };

    if (functionMap[requestKey]) {
      return functionMap[requestKey](params);
    }

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

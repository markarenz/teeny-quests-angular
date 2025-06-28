import { randomBytes } from "crypto";
import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import {
  ScanCommand,
  UpdateItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { fieldNames, tableNames } from "./constants.mjs";

const unmarshallArray = (items) => items.map((i) => unmarshall(i));

const getBodyData = ({ body, path }) => {
  const data = {};
  let valid = true;
  fieldNames[path].forEach((item) => {
    const { fieldName, required } = item;
    if (!body[fieldName] && required) {
      console.error("Invalid input:", fieldName);
      valid = false;
    }
    data[fieldName] = body[fieldName] ?? null;
  });
  return valid ? data : null;
};

const toUrlString = (buffer) => {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};

export const createItem = async (params) => {
  const { path, dynamoDb, body } = params;
  const { id: rawId } = body;
  let success = false;
  let id = null;
  let resp = null;

  const bodyData = getBodyData({ body, path });

  if (bodyData) {
    // For Users, we pull in the sub ID from authentication
    // Otherwise, we create a new ID
    id = rawId ?? toUrlString(randomBytes(32));

    const command = new PutCommand({
      TableName: tableNames[path],
      Item: {
        ...bodyData,
        id,
        dateCreated: new Date().toISOString(),
        dateUpdated: new Date().toISOString(),
      },
    });
    resp = await dynamoDb.send(command);
    success = resp["$metadata"].httpStatusCode === 200;
  }

  return {
    statusCode: success ? 201 : 500,
    body: JSON.stringify({
      message: success ? "Item created successfully." : "Error creating item",
      id: id ?? null,
      resp: resp ? resp["$metadata"]?.httpStatusCode : null,
    }),
  };
};

export const updateItem = async (params) => {
  const { method, path, ip, dynamoDb, body } = params;
  const { id, userId, username, title, description, introduction, itemStatus } =
    body;
  const bodyData = getBodyData({ body, path });

  const command = new PutCommand({
    TableName: tableNames[path],
    Item: {
      ...bodyData,
      dateUpdated: new Date().toISOString(),
    },
  });
  const resp = await dynamoDb.send(command);
  const success = resp["$metadata"].httpStatusCode === 200;
  return {
    statusCode: success ? 204 : 500,
    headers: {
      "access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      path,
      message: success ? "Item updated successfully." : "Error updating item",
      id,
      resp: resp["$metadata"].httpStatusCode,
    }),
  };
};

export const getItemById = async (params) => {
  const { path, dynamoDb, searchParams } = params;
  const id = searchParams?.id ?? null;
  if (searchParams?.id && id.length > 0) {
    const command = new GetCommand({
      TableName: tableNames[path],
      Key: {
        id,
      },
    });
    const resp = await dynamoDb.send(command);
    const item = resp?.Item ? resp?.Item : null;

    if (item) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, item }),
      };
    }
    return {
      statusCode: 404,
      body: JSON.stringify({ success: false, item: null }),
    };
  }
};

export const getItemsByUserId = async (params) => {
  const { path, dynamoDb, searchParams } = params;
  let items = [];
  // TODO: Filter by user ID for author page (FUTURE)
  if (searchParams?.userId && searchParams?.userId.length > 0) {
    const { userId } = searchParams;
    const command = new QueryCommand({
      TableName: tableNames[path],
      IndexName: "userId-index",
      ProjectionExpression: "id, title, description, username, itemStatus",
      KeyConditionExpression: "userId = :value",
      ExpressionAttributeValues: {
        ":value": { S: userId },
      },
    });
    const resp = await dynamoDb.send(command);
    items = resp?.Items ? unmarshallArray(resp?.Items) : null;
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, items }),
  };
};

export const getItems = async (params) => {
  const { path, dynamoDb, searchParams } = params;
  const command = new QueryCommand({
    TableName: tableNames[path],
    IndexName: "itemStatus-index",
    ProjectionExpression: "id, title, description, introduction, username",
    KeyConditionExpression: "itemStatus = :value",
    ExpressionAttributeValues: {
      ":value": { S: "active" },
    },
  });

  const resp = await dynamoDb.send(command);
  const items = resp?.Items ? unmarshallArray(resp?.Items) : null;

  if (items) {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, items }),
    };
  }

  return {
    statusCode: 404,
    body: JSON.stringify({ success: false }),
  };
};

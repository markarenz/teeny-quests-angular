import { randomBytes } from "crypto";
import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

// TODO: validation

const fieldNames = {
  games: ["id", "userId", "userName", "name", "description"],
  users: ["id", "name"],
};

const getBodyData = ({ body, path }) => {
  const data = {};
  fieldNames[path].forEach((fieldName) => {
    console.log("CHECKING...", fieldName, body[fieldName]);
    data[fieldName] = body[fieldName] ?? null;
  });
  return data;
};

const tableNames = {
  games: "prod-tq-games",
  users: "prod-tq-users",
};

const toUrlString = (buffer) => {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};

export const createItem = async (params) => {
  const { method, path, ip, dynamoDb, body } = params;
  const { id: rawId, userId, userName, name, description } = body;

  const bodyData = getBodyData({ body, path });
  // For Users, we pull in the sub ID from authentication
  // Otherwise, we create a new ID
  const id = rawId ?? toUrlString(randomBytes(32));

  const command = new PutCommand({
    TableName: tableNames[path],
    Item: {
      ...bodyData,
      id,
      dateCreated: new Date().toISOString(),
      dateUpdated: new Date().toISOString(),
    },
  });
  const resp = await dynamoDb.send(command);
  const success = resp["$metadata"].httpStatusCode === 200;
  return {
    statusCode: success ? 201 : 500,
    body: JSON.stringify({
      message: success ? "Item created successfully." : "Error creating item",
      id,
      resp: resp["$metadata"].httpStatusCode,
    }),
  };
};

export const updateItem = async (params) => {
  const { method, path, ip, dynamoDb, body } = params;
  const { id, userId, userName, name, description } = body;
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
    statusCode: success ? 201 : 500,
    body: JSON.stringify({
      path,
      message: success ? "Item updated successfully." : "Error updating item",
      id,
      resp: resp["$metadata"].httpStatusCode,
    }),
  };
};

export const getItems = async (params) => {
  const { path, dynamoDb, searchParams } = params;

  const id = searchParams?.id ?? null;
  console.log("ID?", id, searchParams?.id);
  if (searchParams?.id && id.length > 0) {
    console.log("ID!", id);
    const command = new GetCommand({
      TableName: tableNames[path],
      Key: {
        id,
      },
    });
    const resp = await dynamoDb.send(command);
    const item = resp?.Item ?? null;

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

  // TODO: Load more pagination
  const command = new ScanCommand({
    TableName: tableNames[path],
  });
  const resp = await dynamoDb.send(command);
  const items = resp?.Items ?? null;

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

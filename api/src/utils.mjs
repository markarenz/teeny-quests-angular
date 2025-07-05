import { randomBytes } from "crypto";
import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { JwtVerifier } from "aws-jwt-verify";
import { SimpleJwksCache } from "aws-jwt-verify/jwk";
import {
  fieldNames,
  tableNames,
  indexNames,
  authorizationMatchers,
} from "./constants.mjs";

const unmarshallArray = (items) => items.map((i) => unmarshall(i));

const getJwksUri = async () => {
  const response = await fetch(
    "https://accounts.google.com/.well-known/openid-configuration"
  );
  const data = await response.json();
  return data.jwks_uri;
};

async function createVerifier(jwksUri, clientId) {
  const jwksCache = new SimpleJwksCache(); // Use a cache for better performance
  const verifier = JwtVerifier.create(
    {
      issuer: "https://accounts.google.com",
      audience: clientId,
      jwksUri: jwksUri, // Use the retrieved JWKS URI
    },
    {
      jwksCache: jwksCache,
    }
  );
  return verifier;
}

async function verifyJwt(verifier, token) {
  try {
    const payload = await verifier.verify(token);
    console.log("Token is valid. Payload:", payload);
    return payload;
  } catch (error) {
    console.error("Token verification failed:", error);
    throw error;
  }
}

const getAuthorizationForRequest = async (token, params, requestKey) => {
  const jwksUri = await getJwksUri();
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const verifier = await createVerifier(jwksUri, clientId);
  const payload = await verifyJwt(verifier, token);
  // The authorization matchers obj defines which fields to match on for authorization
  const profileFieldName = authorizationMatchers[requestKey]?.profile ?? "";
  const paramsFieldName = authorizationMatchers[requestKey]?.params ?? "";
  return (
    payload[profileFieldName] &&
    params[paramsFieldName] &&
    payload[profileFieldName] === params[paramsFieldName]
  );
};

// --------

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

const generateReturnPayload = (statusCode, body) => {
  return {
    statusCode,
    headers: {
      "access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(body),
  };
};

export const createItem = async (params) => {
  const { path, dynamoDb, body, token, requestKey } = params;
  const { id: rawId } = body;
  let success = false;
  let id = null;
  let resp = null;
  console.log("Creating item for path:", path);

  const isAuthorized = await getAuthorizationForRequest(
    token,
    params,
    requestKey
  );
  console.log("Request authorization:", isAuthorized);
  if (!isAuthorized) {
    return generateReturnPayload(403, { message: "Unauthorized request" });
  }

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

  return generateReturnPayload(success ? 201 : 500, {
    message: success ? "Item created successfully." : "Error creating item",
    id: id ?? null,
    accessPayload,
    resp: resp ? resp["$metadata"]?.httpStatusCode : null,
  });
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
  return generateReturnPayload(success ? 204 : 500, {
    path,
    message: success ? "Item updated successfully." : "Error updating item",
    id,
    resp: resp["$metadata"].httpStatusCode,
  });
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
      return generateReturnPayload(200, { success: true, item });
    }
    return generateReturnPayload(400, { success: true, item: null });
  }
};

export const getItemsByUserId = async (params) => {
  const { path, dynamoDb, searchParams, requestKey } = params;
  let items = [];
  // TODO: Filter by user ID for author page (FUTURE)
  if (searchParams?.userId && searchParams?.userId.length > 0) {
    const { userId } = searchParams;
    const command = new QueryCommand({
      TableName: tableNames[path],
      IndexName: indexNames[requestKey],
      ProjectionExpression: "id, title, description, username, itemStatus",
      KeyConditionExpression: "userId = :value",
      ExpressionAttributeValues: {
        ":value": { S: userId },
      },
    });
    const resp = await dynamoDb.send(command);
    items = resp?.Items ? unmarshallArray(resp?.Items) : null;
  }
  return generateReturnPayload(200, { success: true, items });
};

export const getItems = async (params) => {
  const { path, dynamoDb, requestKey } = params;
  const command = new QueryCommand({
    TableName: tableNames[path],
    IndexName: indexNames[requestKey],
    ProjectionExpression: fieldNames[path]
      .filter((item) => !item.detailOnly)
      .map((item) => item.fieldName)
      .join(", "),
    KeyConditionExpression: "itemStatus = :value",
    ExpressionAttributeValues: {
      ":value": { S: "active" },
    },
  });

  const resp = await dynamoDb.send(command);
  const items = resp?.Items ? unmarshallArray(resp?.Items) : null;

  if (items) {
    return generateReturnPayload(200, { success: true, items });
  }
  return generateReturnPayload(404, { success: false, items: null });
};

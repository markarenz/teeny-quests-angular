import { randomBytes } from 'crypto';
import { PutCommand, GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { QueryCommand } from '@aws-sdk/client-dynamodb';
import { JwtVerifier } from 'aws-jwt-verify';
import { SimpleJwksCache } from 'aws-jwt-verify/jwk';
import {
  fieldNames,
  tableNames,
  indexNames,
  authorizationMatchers,
} from './constants.mjs';

const unmarshallArray = items => items.map(i => unmarshall(i));

/* JWT FUNCTIONS FOR AUTHORIZATION */
/**
 * Asynchronously retrieves the JWKS (JSON Web Key Set) URI from Google's OpenID configuration.
 *
 * @async
 * @returns {Promise<string>} The JWKS URI as a string.
 * @throws {Error} If the fetch request fails or the response is invalid.
 */
const getJwksUri = async () => {
  const response = await fetch(
    'https://accounts.google.com/.well-known/openid-configuration'
  );
  const data = await response.json();
  return data.jwks_uri;
};

/**
 * Creates a JWT verifier instance configured with the provided JWKS URI and client ID.
 *
 * @async
 * @param {string} jwksUri - The URI to the JSON Web Key Set (JWKS) used for verifying JWT signatures.
 * @param {string} clientId - The client ID (audience) that the JWT must be issued for.
 * @returns {Promise<JwtVerifier>} A promise that resolves to a configured JwtVerifier instance.
 */

async function createVerifier(jwksUri, clientId) {
  const jwksCache = new SimpleJwksCache(); // Use a cache for better performance
  const verifier = JwtVerifier.create(
    {
      issuer: 'https://accounts.google.com',
      tokenUse: 'id',
      audience: clientId,
      jwksUri: jwksUri, // Use the retrieved JWKS URI
    },
    {
      jwksCache: jwksCache,
    }
  );
  return verifier;
}

/**
 * Verifies a JWT token using the provided verifier.
 *
 * @async
 * @param {Object} verifier - An object with a `verify` method to validate the JWT.
 * @param {string} token - The JWT token to verify.
 * @returns {Promise<Object>} The decoded payload if the token is valid.
 * @throws {Error} If token verification fails.
 */

async function verifyJwt(verifier, token) {
  try {
    const payload = await verifier.verify(token);
    return payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    throw error;
  }
}

/**
 * Checks if the provided JWT token authorizes the request based on dynamic field matchers.
 *
 * @async
 * @param {string} token - The JWT token to verify and extract payload from.
 * @param {Object} params - The parameters of the request to match against the payload.
 * @param {string} requestKey - The key used to determine which fields to match for authorization.
 * @returns {Promise<boolean>} Resolves to true if the authorization fields match, false otherwise.
 */

const getAuthorizationForRequest = async (token, params, requestKey) => {
  const jwksUri = await getJwksUri();
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const verifier = await createVerifier(jwksUri, clientId);
  const payload = await verifyJwt(verifier, token);
  let isAuthorized = false;
  // The authorization matchers obj defines which fields to match on for authorization
  const authorizationMatcher = authorizationMatchers[requestKey];
  const profileFieldName = authorizationMatcher?.profile ?? '';
  const paramsFieldName = authorizationMatcher?.bodyParam ?? '';
  if (
    !!payload[profileFieldName] &&
    !!params.body[paramsFieldName] &&
    payload[profileFieldName] === params.body[paramsFieldName]
  ) {
    isAuthorized = true;
  }
  return isAuthorized;
};

/**
 * Extracts and validates data from the request body based on the specified path's field definitions.
 *
 * @param {Object} params - The parameters object.
 * @param {Object} params.body - The request body containing input data.
 * @param {string} params.path - The path used to determine which fields to extract and validate.
 * @returns {Object|null} The extracted data object if all required fields are present; otherwise, null.
 */

const getBodyData = ({ body, path }) => {
  const data = {};
  let valid = true;
  fieldNames[path].forEach(item => {
    const { fieldName, required } = item;
    if (!body[fieldName] && required) {
      valid = false;
    }
    data[fieldName] = body[fieldName] ?? null;
  });
  return valid ? data : null;
};

/**
 * Converts a Buffer to a URL-safe base64 encoded string.
 *
 * Replaces '+' with '-', '/' with '_', and removes '=' padding to make the string URL-safe.
 *
 * @param {Buffer} buffer - The buffer to encode.
 * @returns {string} The URL-safe base64 encoded string.
 */

const toUrlString = buffer => {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

/**
 * Generates a standardized HTTP response payload.
 *
 * @param {number} statusCode - The HTTP status code to return.
 * @param {Object} body - The response body to be stringified.
 * @returns {Object} The response payload with statusCode, headers, and stringified body.
 */

const generateReturnPayload = (statusCode, body) => {
  return {
    statusCode,
    headers: {
      'access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(body),
  };
};

/**
 * Generates a standard CORS preflight (OPTIONS) response object.
 *
 * @param {object} _params - Parameters for the response (currently unused).
 * @returns {object} The response object containing statusCode, headers, and body for CORS preflight.
 */

export const returnOptionsResponse = _params => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Access-Token',
    },
    body: JSON.stringify({ message: 'CORS preflight response' }),
  };
};

/**
 * Creates a new item in the DynamoDB table specified by the path.
 * Authorizes the request, processes the body data, generates a unique ID if necessary,
 * and inserts the item with creation and update timestamps.
 *
 * @async
 * @function createItem
 * @param {Object} params - The parameters for item creation.
 * @returns {Promise<Object>} The response payload containing status, message, item ID, and HTTP status code.
 */

export const createItem = async params => {
  const { path, dynamoDb, body, token, requestKey } = params;
  const { id: rawId } = body;
  let success = false;
  let id = null;
  let resp = null;
  const isAuthorized = await getAuthorizationForRequest(
    token,
    params,
    requestKey
  );
  console.error('isAuthorized', isAuthorized);
  if (!isAuthorized) {
    console.error('Unauthorized request for createItem');
    return generateReturnPayload(403, { message: 'Unauthorized request' });
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
    success = resp['$metadata'].httpStatusCode === 200;
  }

  return generateReturnPayload(success ? 201 : 500, {
    message: success ? 'Item created successfully.' : 'Error creating item',
    id: id ?? null,
    resp: resp ? resp['$metadata']?.httpStatusCode : null,
  });
};

/**
 * Retrieves active items from a DynamoDB table based on the provided parameters.
 *
 * @async
 * @function getItems
 * @param {Object} params - The parameters for the query.
 * @param {import('@aws-sdk/client-dynamodb').DynamoDBClient} params.dynamoDb - The DynamoDB client instance.
 * @returns {Promise<Object>} The response payload containing a success flag and the list of items (if found).
 */

export const getItems = async params => {
  const { path, dynamoDb, requestKey } = params;
  const command = new QueryCommand({
    TableName: tableNames[path],
    IndexName: indexNames[requestKey],
    ProjectionExpression: fieldNames[path]
      .filter(item => !item.detailOnly)
      .map(item => item.fieldName)
      .join(', '),
    KeyConditionExpression: 'itemStatus = :value',
    ExpressionAttributeValues: {
      ':value': { S: 'active' },
    },
  });

  const resp = await dynamoDb.send(command);
  const items = resp?.Items ? unmarshallArray(resp?.Items) : null;

  if (items) {
    return generateReturnPayload(200, { success: true, items });
  }
  return generateReturnPayload(404, { success: false, items: null });
};

/**
 * Retrieves items from a DynamoDB table filtered by user ID.
 *
 * @async
 * @function getItemsByUserId
 * @param {Object} params - The parameters for the query.
 * @param {import('@aws-sdk/client-dynamodb').DynamoDBClient} params.dynamoDb - The DynamoDB client instance.
 * @returns {Promise<Object>} The response payload containing the items and success status.
 */

export const getItemsByUserId = async params => {
  const { path, dynamoDb, searchParams, requestKey } = params;
  let items = [];
  // TODO: Filter by user ID for author page (FUTURE)
  if (searchParams?.userId && searchParams?.userId.length > 0) {
    const { userId } = searchParams;
    const command = new QueryCommand({
      TableName: tableNames[path],
      IndexName: indexNames[requestKey],
      ProjectionExpression: 'id, title, description, username, itemStatus',
      KeyConditionExpression: 'userId = :value',
      ExpressionAttributeValues: {
        ':value': { S: userId },
      },
    });
    const resp = await dynamoDb.send(command);
    items = resp?.Items ? unmarshallArray(resp?.Items) : null;
  }
  return generateReturnPayload(200, { success: true, items });
};

/**
 * Retrieves items by game ID, optionally filtering by user ID if provided in searchParams.
 *
 * @async
 * @function getItemsByGameId
 * @param {Object} params - The parameters for the query.
 * @param {string} params.path - The path used to determine the table name.
 * @param {Object} params.dynamoDb - The DynamoDB client instance.
 * @param {Object} params.searchParams - Search parameters, may include userId for filtering.
 * @param {string} params.requestKey - Key used to determine the index name.
 * @param {string} params.gameId - The game ID to filter items by.
 * @returns {Promise<Object>} The response payload containing the items.
 */

export const getItemsByGameId = async params => {
  const { path, dynamoDb, searchParams, requestKey } = params;
  let items = [];
  if (searchParams?.gameId && searchParams?.gameId.length > 0) {
    const { gameId } = searchParams;
    const command = new QueryCommand({
      TableName: tableNames[path],
      IndexName: indexNames[requestKey],
      ProjectionExpression: 'id, gameId, userId, dateCreated, dateUpdated',
      KeyConditionExpression: 'gameId = :value',
      ExpressionAttributeValues: {
        ':value': { S: gameId },
      },
    });
    const resp = await dynamoDb.send(command);
    items = resp?.Items ? unmarshallArray(resp?.Items) : null;
  }
  return generateReturnPayload(200, { success: true, items });
};

/**
 * Retrieves an item by its ID from a DynamoDB table.
 *
 * @async
 * @param {Object} params - The parameters for the function.
 * @param {import('@aws-sdk/lib-dynamodb').DynamoDBDocumentClient} params.dynamoDb - The DynamoDB DocumentClient instance.
 * @param {string} [params.searchParams.id] - The ID of the item to retrieve.
 * @returns {Promise<Object|undefined>} A promise that resolves to a payload object containing the item if found, or null if not found.
 */

export const getItemById = async params => {
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
    return generateReturnPayload(200, { success: true, item: null });
  }
};

/**
 * Updates an item in the DynamoDB table based on the provided parameters.
 *
 * @async
 * @param {Object} params - The parameters for updating the item.
 * @returns {Promise<Object>} The response payload indicating success or failure of the update operation.
 */

export const updateItem = async params => {
  const { path, dynamoDb, body, token, requestKey } = params;
  const { id } = body;

  const bodyData = getBodyData({ body, path });
  const isAuthorized = await getAuthorizationForRequest(
    token,
    params,
    requestKey
  );
  if (!isAuthorized) {
    return generateReturnPayload(403, { message: 'Unauthorized request' });
  }

  const command = new PutCommand({
    TableName: tableNames[path],
    Item: {
      ...bodyData,
      dateUpdated: new Date().toISOString(),
    },
  });
  const resp = await dynamoDb.send(command);
  const success = resp['$metadata'].httpStatusCode === 200;
  return generateReturnPayload(success ? 204 : 500, {
    path,
    message: success ? 'Item updated successfully.' : 'Error updating item',
    id,
    resp: resp['$metadata'].httpStatusCode,
  });
};

export const deleteItemById = async params => {
  const { path, dynamoDb, searchParams } = params;
  const id = searchParams?.id ?? null;
  if (searchParams?.id && id.length > 0) {
    const command = new DeleteCommand({
      TableName: tableNames[path],
      Key: {
        id,
      },
    });
    await dynamoDb.send(command);
    return generateReturnPayload(200, { success: true, item: null });
  }
  return generateReturnPayload(200, { success: false, item: null });
};

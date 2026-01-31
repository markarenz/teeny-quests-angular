import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import {
  createItem,
  getItemById,
  getItems,
  getItemsByGameId,
  getItemsByUserId,
  deleteItemById,
  updateItem,
} from './utils';
import { Params } from './models';
import { AttributeValue } from 'aws-lambda/trigger/dynamodb-stream';

const ddbMock = mockClient(DynamoDBDocumentClient);
const mockToken = 'test-token';
const mockPayload = {
  userId: 'user-123',
  sub: 'user-123',
  email: 'user123@example.com',
  'cognito:username': 'testuser',
};
const mockParams: Params = {
  path: 'games',
  dynamoDb: new DynamoDBClient({}),
  body: {
    name: 'New Game',
    genre: 'Adventure',
    id: 'game-123',
    userId: 'user-123',
    itemStatus: 'active',
    username: 'testuser',
    title: 'Exciting Game',
    description: 'An exciting adventure game.',
    rating: 4.5,
    content: 'Game content goes here.',
  },
  token: mockToken,
  requestKey: 'games_post',
};
const mockVerify = jest.fn(() => mockPayload);

jest.mock('aws-jwt-verify', () => ({
  // Ensure the module is treated as an ES Module for compatibility
  __esModule: true,
  // Mock the CognitoJwtVerifier class
  CognitoJwtVerifier: {
    // Mock the static create method to return an object with the mock verify function
    create: jest.fn(() => ({
      verify: mockVerify,
    })),
  },
  // If you also use the generic JwtVerifier, mock it similarly
  JwtVerifier: {
    create: jest.fn(() => ({
      verify: mockVerify,
    })),
  },
}));

beforeEach(() => {
  ddbMock.reset();
});

describe('Utils', () => {
  describe('getItemById', () => {
    it('should return undefined if id is not provided', async () => {
      const mockDynamoDb = new DynamoDBClient({});
      const params: Params = {
        path: '/games',
        searchParams: {},
        dynamoDb: mockDynamoDb,
      };
      const result = await getItemById(params);
      expect(result).toBeUndefined();
    });
  });
  describe('unmarshall', () => {
    it('should convert DynamoDB item to JavaScript object', () => {
      const dynamoDbItem = {
        id: { S: '123' },
        name: { S: 'Test Game' },
        score: { N: '42' },
      };
      const result = unmarshall(dynamoDbItem);
      expect(result).toEqual({
        id: '123',
        name: 'Test Game',
        score: 42,
      });
    });
  });
  describe('createItem', () => {
    it('should create a new item in DynamoDB', async () => {
      const mockItem = { id: '123', name: 'Test Item' };
      ddbMock.on(PutCommand).resolves({
        Attributes: mockItem,
      });

      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              jwks_uri: 'https://www.googleapis.com/oauth2/v3/certs',
            }),
        })
      ) as jest.Mock;

      const result = await createItem(mockParams);

      expect(result.hasOwnProperty('body')).toBe(true);
      expect(result.hasOwnProperty('headers')).toBe(true);
      expect(result.hasOwnProperty('statusCode')).toBe(true);
      expect(result.statusCode).toBe(201);
    });
  });
  describe('getItemById', () => {
    it('should retrieve an item by ID from DynamoDB', async () => {
      const mockItem = { id: 'game-123', name: 'Test Game' };
      ddbMock.on(GetCommand).resolves({
        Item: mockItem,
      });

      const params: Params = {
        path: 'games',
        dynamoDb: new DynamoDBClient({}),
        searchParams: { id: 'game-123' },
      };

      const result = await getItemById(params);

      expect(result?.hasOwnProperty('body')).toBe(true);
      expect(result?.hasOwnProperty('headers')).toBe(true);
      expect(result?.hasOwnProperty('statusCode')).toBe(true);
      expect(result?.statusCode).toBe(200);
    });
  });
  describe('getItems', () => {
    it('should retrieve items from DynamoDB', async () => {
      ddbMock.on(QueryCommand).resolves({});

      const result = await getItems({
        ...mockParams,
        path: 'games',
        requestKey: 'games_get',
      });
      expect(result?.hasOwnProperty('body')).toBe(true);
      expect(result?.hasOwnProperty('headers')).toBe(true);
      expect(result?.hasOwnProperty('statusCode')).toBe(true);
      expect(result?.statusCode).toBe(200);
    });
  });
  describe('getItemsByGameId', () => {
    it('should retrieve items by game ID from DynamoDB', async () => {
      const mockItems = [
        { id: 'item-1', gameId: 'game-123', name: 'Item One' },
        { id: 'item-2', gameId: 'game-123', name: 'Item Two' },
      ];
      ddbMock.on(QueryCommand).resolves({});

      const result = await getItemsByGameId({
        ...mockParams,
        path: 'versions',
        searchParams: { gameId: 'game-123' },
        dynamoDb: new DynamoDBClient({}),
        requestKey: 'versions_get_gameId',
      });

      expect(result?.hasOwnProperty('body')).toBe(true);
      expect(result?.hasOwnProperty('headers')).toBe(true);
      expect(result?.hasOwnProperty('statusCode')).toBe(true);
      expect(result?.statusCode).toBe(200);
    });
  });
  describe('getItemsByUserId', () => {
    it('should retrieve items by user ID from DynamoDB', async () => {
      const mockItems = [
        { id: 'game-1', userId: 'user-123', title: 'Game One' },
        { id: 'game-2', userId: 'user-123', title: 'Game Two' },
      ];
      ddbMock.on(QueryCommand).resolves({});

      const result = await getItemsByUserId({
        ...mockParams,
        path: 'games',
        searchParams: { userId: 'user-123' },
        dynamoDb: new DynamoDBClient({}),
        requestKey: 'games_get_userId',
      });

      expect(result?.hasOwnProperty('body')).toBe(true);
      expect(result?.hasOwnProperty('headers')).toBe(true);
      expect(result?.hasOwnProperty('statusCode')).toBe(true);
      expect(result?.statusCode).toBe(200);
    });
  });
  describe('updateItem', () => {
    it('should update an existing item in DynamoDB', async () => {
      const mockItem = { id: '123', name: 'Updated Item' };
      ddbMock.on(PutCommand).resolves({
        Attributes: mockItem,
      });

      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              jwks_uri: 'https://www.googleapis.com/oauth2/v3/certs',
            }),
        })
      ) as jest.Mock;
      const result = await updateItem({
        ...mockParams,
        body: mockItem,
      });

      expect(result.hasOwnProperty('body')).toBe(true);
    });
  });
  describe('deleteItemById', () => {
    it('should delete an item by ID from DynamoDB', async () => {
      ddbMock.on(DeleteCommand).resolves({});

      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              jwks_uri: 'https://www.googleapis.com/oauth2/v3/certs',
            }),
        })
      ) as jest.Mock;

      const result = await deleteItemById({
        ...mockParams,
        searchParams: { id: 'game-123' },
      });

      expect(result.hasOwnProperty('body')).toBe(true);
    });
  });
});

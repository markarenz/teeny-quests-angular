import { getUserByIdOrCreateUser } from './auth-service-utils';
import { usersApiUrl } from '@config/index';
import fetchMock from 'fetch-mock';

const userMock = {
  id: '123',
  username: 'test',
  itemStatus: 'active',
};

beforeEach(() => {
  fetchMock.hardReset();
  fetchMock.mockGlobal();
});

afterEach(() => {
  fetchMock.hardReset();
});

describe('getUserByIdOrCreateUser', () => {
  it('should get user if it exists', async () => {
    const id = '123';
    const urlGet = `${usersApiUrl}?id=${id}`;

    fetchMock.get(
      urlGet,
      { item: userMock, success: true },
      {
        delay: 10,
      }
    );
    const result = await getUserByIdOrCreateUser({ id, token: 'testToken' });
    expect(result).toBeDefined();
  });

  it('should create a user if it does not exist', async () => {
    const id = '123';
    const urlGet = `${usersApiUrl}?id=${id}`;
    const urlPost = usersApiUrl;

    fetchMock
      .get(
        urlGet,
        { item: null, success: false },
        {
          delay: 0,
        }
      )
      .post(
        urlPost,
        {
          status: 201,
          body: { item: userMock },
        },
        {
          delay: 0,
        }
      );

    const result = await getUserByIdOrCreateUser({ id, token: 'testtoken' });
    expect(result).toBeDefined();
  });
});

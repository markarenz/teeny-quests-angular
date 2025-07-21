import { getUserByIdOrCreateUser } from './auth-service-utils';
import { usersApiUrl } from '@config/index';
import fetchMock from 'fetch-mock';

const userMock = {
  id: '123',
  username: 'test',
  itemStatus: 'active',
};

beforeEach(() => {
  fetchMock.unmockGlobal();
});

describe('getUserByIdOrCreateUser', () => {
  it('should get user if it exists', async () => {
    const id = '123';
    const urlGet = `${usersApiUrl}?id=${id}`;

    fetchMock.mockGlobal().get(
      urlGet,
      { item: userMock, success: true },
      {
        delay: 10,
      }
    );
    const result = await getUserByIdOrCreateUser({ id });
    expect(result).toBeDefined();
  });

  it('should create a user if it does not exist', async () => {
    const id = '123';
    const urlGet = `${usersApiUrl}?id=${id}`;
    const urlPost = usersApiUrl;

    fetchMock
      .mockGlobal()
      .get(
        urlGet,
        { item: null, success: false },
        {
          delay: 0,
        }
      )
      .post(
        urlPost,
        { item: userMock },
        {
          delay: 0,
        }
      );

    const result = await getUserByIdOrCreateUser({ id });
    expect(result).toBeDefined();
  });
});

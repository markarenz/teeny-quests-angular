import { usersApiUrl } from '@config/index';
import { logger } from '@app/features/main/utils/logger';
import { getRandomUsername } from '@app/features/main/utils';

export const getUserByIdOrCreateUser = async ({
  id,
  token,
}: {
  id: string;
  token: string | null;
}) => {
  let userDataResponse = null;
  userDataResponse = await fetch(`${usersApiUrl}?id=${id}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  }).then((res) => res.json());
  if (userDataResponse.success) {
    logger({ type: 'info', message: '[getUserByIdOrCreateUser]: User found' });
    return userDataResponse.item;
  } else {
    logger({
      type: 'info',
      message: '[getUserByIdOrCreateUser]: Creating user',
    });
    userDataResponse = await fetch(usersApiUrl, {
      method: 'POST',
      headers: { Accept: 'application/json', 'x-access-token': token ?? '' },
      body: JSON.stringify({
        id,
        username: getRandomUsername(),
        itemStatus: 'active',
      }),
    }).then((res) => res.json());
    return userDataResponse.item;
  }
};

import { normalize, denormalize } from '@data-client/normalizr';
import { IDEntity } from '__tests__/new';

import { schema } from '../src';

const data = [
  { id: 1, type: 'admin' },
  { id: 2, type: 'user' },
];
class User extends IDEntity {
  readonly type = 'user';
}
class Admin extends IDEntity {
  readonly type = 'admin';
}

const myArray = new schema.Array(
  {
    admins: User,
    users: Admin,
  },
  (input: User | Admin, parent, key) => `${input.type}s`,
);

const normalizedData = normalize(myArray, data);

const denormalizedData = denormalize(
  myArray,
  normalizedData.result,
  normalizedData.entities,
);

if (denormalizedData !== undefined && typeof denormalizedData !== 'symbol') {
  denormalizedData.forEach(value => {
    value.type;
    value.pk();
    // @ts-expect-error
    value.doesnotexist;
  });
}

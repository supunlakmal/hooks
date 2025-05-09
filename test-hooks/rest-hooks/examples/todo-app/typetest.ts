/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useQuery, useController, useSuspense } from '@data-client/react';

import {
  queryRemainingTodos,
  TodoResource,
} from './src/resources/TodoResource';
import { UserResource } from './src/resources/UserResource';

function useTest() {
  const ctrl = useController();
  const payload = { id: 1, title: '', userId: 1 };
  ctrl.fetch(TodoResource.getList.push, payload);

  const todos = useSuspense(TodoResource.getList, { userId: 1 });
  useSuspense(TodoResource.getList);
  todos.map((todo) => {
    todo.pk();
    todo.title;
    ctrl.fetch(
      TodoResource.partialUpdate,
      { id: todo.id },
      { completed: true },
    );
  });

  let remaining = useQuery(queryRemainingTodos, { userId: 1 });

  if (remaining !== undefined) remaining++;

  const users = useSuspense(UserResource.getList);
  users.map((user) => {
    user.name;
  });
}

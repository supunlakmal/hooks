import { useQuery } from '@data-client/react';
import { queryRemainingTodos } from 'resources/TodoResource';

export default function TodoStats({ userId }: { userId?: number }) {
  const remaining = useQuery(queryRemainingTodos, { userId });

  return <div>{remaining ?? 0} tasks remaining</div>;
}

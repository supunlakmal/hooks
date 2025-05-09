import { useCache } from '@data-client/react';

import { TodoResource } from './api';

export default function TodoStats({ userId }: { userId?: number }) {
  const remaining = useCache(TodoResource.queryRemaining, { userId });

  return (
    <div style={{ textAlign: 'center' }}>
      {remaining} tasks remaining
    </div>
  );
}

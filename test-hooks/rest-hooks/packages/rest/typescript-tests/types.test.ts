/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Entity, schema } from '@data-client/endpoint';
import { useController, useSuspense } from '@data-client/react';
import { User } from '__tests__/new';

import resource from '../src/resource';
import RestEndpoint, { GetEndpoint, MutateEndpoint } from '../src/RestEndpoint';

it('RestEndpoint construct and extend with typed options', () => {
  new RestEndpoint({
    path: '/todos/',
    getOptimisticResponse(snap, body) {
      return body;
    },
    schema: User,
    method: 'POST',
  });
  // variable/unknown number of args
  new RestEndpoint({
    path: '/todos/',
    searchParams: {} as { userId?: string | number } | undefined,
    getOptimisticResponse(snap, ...args) {
      return args[args.length - 1];
    },
    schema: User,
    method: 'POST',
  });
  new RestEndpoint({
    path: '/todos/:id',
    searchParams: {} as { userId?: string | number } | undefined,
    getOptimisticResponse(snap, params, body) {
      return body;
    },
    schema: User,
    method: 'POST',
  });
  new RestEndpoint({
    path: '/todos/:id',
    searchParams: {} as { userId?: string | number } | undefined,
    getOptimisticResponse(snap, params, body) {
      return body;
    },
    schema: User,
    method: 'POST',
  });

  const nopath = new RestEndpoint({
    path: '/todos/',
    schema: User,
    method: 'POST',
  });
  const somepath = new RestEndpoint({
    path: '/todos/:id',
    schema: User,
    method: 'POST',
  });

  nopath.extend({
    getOptimisticResponse(snap, body) {
      return body;
    },
  });
  nopath.extend({
    searchParams: {} as { userId?: string | number } | undefined,
    getOptimisticResponse(snap, ...args) {
      return args[args.length - 1];
    },
  });
  somepath.extend({
    searchParams: {} as { userId?: string | number } | undefined,
    getOptimisticResponse(snap, args, body) {
      return body;
    },
  });
});

it('should customize resources', () => {
  class Todo extends Entity {
    id = '';
    userId = 0;
    title = '';
    completed = false;

    static key = 'Todo';
    pk() {
      return this.id;
    }
  }

  const TodoResource = resource({
    path: '/todos/:id',
    schema: Todo,
  });
  TodoResource.create.extend({
    searchParams: {} as { userId?: string | number } | undefined,
    getOptimisticResponse(snap, ...args) {
      return args[args.length - 1];
    },
  });
  const partial = TodoResource.partialUpdate.extend({
    getOptimisticResponse(snap, { id }, body) {
      return {
        id,
        ...body,
      };
    },
  });
  () => partial({ id: 5 }, { title: 'hi' });
  const a: MutateEndpoint<{
    path: '/todos/';
    body: Partial<Todo>;
    schema: typeof Todo;
  }> = TodoResource.create.extend({ schema: Todo }) as any;
  a.extend({
    searchParams: {} as { userId?: string | number } | undefined,
    getOptimisticResponse(snap, ...args) {
      return args[args.length - 1];
    },
  });

  () => useSuspense(TodoResource.getList);
});

// path: ['/todos', '/todos/:id', '/todos/:id?', string]
it('should precisely type function arguments', () => {
  // path: '/todos'
  () => {
    const optionalUndefSearch = new RestEndpoint({
      path: '/todos',
      searchParams: {} as
        | {
            userId?: string | number;
          }
        | undefined,
    });
    const optionalSearch = new RestEndpoint({
      path: '/todos',
      searchParams: {} as {
        userId?: string | number;
      },
    });
    const undef = new RestEndpoint({
      path: '/todos',
      searchParams: undefined,
    });
    const requiredSearch = new RestEndpoint({
      path: '/todos',
      searchParams: {} as {
        userId: string | number;
      },
    });
    const noSearch = new RestEndpoint({
      path: '/todos',
    });
    () => optionalUndefSearch();
    () => optionalUndefSearch({});
    () => optionalUndefSearch({ userId: 'hi' });
    // @ts-expect-error
    () => optionalUndefSearch(5);
    // @ts-expect-error
    () => optionalUndefSearch({ userId: 'hi' }, { userId: 'hi' });

    () => optionalSearch();
    () => optionalSearch({});
    () => optionalSearch({ userId: 'hi' });
    // @ts-expect-error
    () => optionalSearch(5);
    // @ts-expect-error
    () => optionalSearch({ userId: 'hi' }, { userId: 'hi' });

    // @ts-expect-error
    () => requiredSearch();
    // @ts-expect-error
    () => requiredSearch({});
    () => requiredSearch({ userId: 'hi' });
    // @ts-expect-error
    () => requiredSearch(5);
    // @ts-expect-error
    () => requiredSearch({ userId: 'hi' }, { userId: 'hi' });

    () => undef();
    // @ts-expect-error
    () => undef({});
    // @ts-expect-error
    () => undef({ userId: 'hi' });
    // @ts-expect-error
    () => undef(5);

    () => noSearch();
    // @ts-expect-error
    () => noSearch({});
    // @ts-expect-error
    () => noSearch({ userId: 'hi' });
    // @ts-expect-error
    () => noSearch(5);
  };
  // path: '/todos/:id?'
  () => {
    const optionalUndefSearch = new RestEndpoint({
      path: '/todos/:id?',
      searchParams: {} as
        | {
            userId?: string | number;
          }
        | undefined,
    });
    const optionalSearch = new RestEndpoint({
      path: '/todos/:id?',
      searchParams: {} as {
        userId?: string | number;
      },
    });
    const undef = new RestEndpoint({
      path: '/todos/:id?',
      searchParams: undefined,
    });
    const requiredSearch = new RestEndpoint({
      path: '/todos/:id?',
      searchParams: {} as {
        userId: string | number;
      },
    });
    const noSearch = new RestEndpoint({
      path: '/todos/:id?',
    });
    () => optionalUndefSearch();
    () => optionalUndefSearch({});
    () => optionalUndefSearch({ id: '5' });
    () => optionalUndefSearch({ userId: 'hi' });
    () => optionalUndefSearch({ userId: 'hi', id: '5' });
    // @ts-expect-error
    () => optionalUndefSearch(5);
    // @ts-expect-error
    () => optionalUndefSearch({ userId: 'hi' }, { userId: 'hi' });

    () => optionalSearch();
    () => optionalSearch({});
    () => optionalSearch({ id: '5' });
    () => optionalSearch({ userId: 'hi' });
    () => optionalSearch({ userId: 'hi', id: '5' });
    // @ts-expect-error
    () => optionalSearch(5);
    // @ts-expect-error
    () => optionalSearch({ userId: 'hi' }, { userId: 'hi' });

    // @ts-expect-error
    () => requiredSearch();
    // @ts-expect-error
    () => requiredSearch({});
    // @ts-expect-error
    () => requiredSearch({ id: '5' });
    () => requiredSearch({ userId: 'hi' });
    () => requiredSearch({ userId: 'hi', id: '5' });
    // @ts-expect-error
    () => requiredSearch(5);
    // @ts-expect-error
    () => requiredSearch({ userId: 'hi' }, { userId: 'hi' });

    () => undef();
    () => undef({});
    () => undef({ id: '5' });
    // @ts-expect-error
    () => undef({ userId: 'hi' });
    // @ts-expect-error
    () => undef(5);

    () => noSearch();
    () => noSearch({});
    () => noSearch({ id: '5' });
    // @ts-expect-error
    () => noSearch({ userId: 'hi' });
    // @ts-expect-error
    () => noSearch(5);
  };
  // path: '/todos/:id'
  () => {
    const optionalUndefSearch = new RestEndpoint({
      path: '/todos/:id',
      searchParams: {} as
        | {
            userId?: string | number;
          }
        | undefined,
    });
    const optionalSearch = new RestEndpoint({
      path: '/todos/:id',
      searchParams: {} as {
        userId?: string | number;
      },
    });
    const undef = new RestEndpoint({
      path: '/todos/:id',
      searchParams: undefined,
    });
    const requiredSearch = new RestEndpoint({
      path: '/todos/:id',
      searchParams: {} as {
        userId: string | number;
      },
    });
    const noSearch = new RestEndpoint({
      path: '/todos/:id',
    });
    // @ts-expect-error
    () => optionalUndefSearch();
    () => optionalUndefSearch({ id: '5' });
    () => optionalUndefSearch({ id: '5', userId: 'hi' });
    // @ts-expect-error
    () => optionalUndefSearch(5);
    () =>
      // @ts-expect-error
      optionalUndefSearch({ id: '5', userId: 'hi' }, { id: '5', userId: 'hi' });

    // @ts-expect-error
    () => optionalSearch();
    () => optionalSearch({ id: '5' });
    () => optionalSearch({ id: '5', userId: 'hi' });
    // @ts-expect-error
    () => optionalSearch(5);
    // @ts-expect-error
    () => optionalSearch({ id: '5', userId: 'hi' }, { id: '5', userId: 'hi' });

    // @ts-expect-error
    () => requiredSearch();
    // @ts-expect-error
    () => requiredSearch({ id: '5' });
    () => requiredSearch({ id: '5', userId: 'hi' });
    // @ts-expect-error
    () => requiredSearch(5);
    // @ts-expect-error
    () => requiredSearch({ id: '5', userId: 'hi' }, { id: '5', userId: 'hi' });

    // @ts-expect-error
    () => undef();
    // @ts-expect-error
    () => undef({});
    // @ts-expect-error
    () => undef({ id: '5', userId: 'hi' });
    // @ts-expect-error
    () => undef(5);

    // @ts-expect-error
    () => noSearch();
    () => noSearch({ id: '5' });
    // @ts-expect-error
    () => noSearch({ id: '5', userId: 'hi' });
    // @ts-expect-error
    () => noSearch(5);
  };
  // path: string
  () => {
    const optionalUndefSearch = new RestEndpoint({
      path: '' as string,
      searchParams: {} as
        | {
            userId?: string | number;
          }
        | undefined,
    });
    const optionalSearch = new RestEndpoint({
      path: '' as string,
      searchParams: {} as {
        userId?: string | number;
      },
    });
    const undef = new RestEndpoint({
      path: '' as string,
      searchParams: undefined,
    });
    const requiredSearch = new RestEndpoint({
      path: '' as string,
      searchParams: {} as {
        userId: string | number;
      },
    });
    const noSearch = new RestEndpoint({
      path: '' as string,
    });
    () => optionalUndefSearch();
    () => optionalUndefSearch({});
    () => optionalUndefSearch({ id: '5' });
    () => optionalUndefSearch({ userId: 'hi' });
    () => optionalUndefSearch({ userId: 'hi', id: '5' });
    // @ts-expect-error
    () => optionalUndefSearch(5);
    // @ts-expect-error
    () => optionalUndefSearch({ userId: 'hi' }, { userId: 'hi' });

    () => optionalSearch();
    () => optionalSearch({});
    () => optionalSearch({ id: '5' });
    () => optionalSearch({ userId: 'hi' });
    () => optionalSearch({ userId: 'hi', id: '5' });
    // @ts-expect-error
    () => optionalSearch(5);
    // @ts-expect-error
    () => optionalSearch({ userId: 'hi' }, { userId: 'hi' });

    // @ts-expect-error
    () => requiredSearch();
    // @ts-expect-error
    () => requiredSearch({});
    // @ts-expect-error
    () => requiredSearch({ id: '5' });
    () => requiredSearch({ userId: 'hi' });
    () => requiredSearch({ userId: 'hi', id: '5' });
    // @ts-expect-error
    () => requiredSearch(5);
    // @ts-expect-error
    () => requiredSearch({ userId: 'hi' }, { userId: 'hi' });

    () => undef();
    () => undef({});
    () => undef({ id: '5' });
    // @ts-expect-error
    () => undef(5);

    () => noSearch();
    () => noSearch({});
    () => noSearch({ id: '5' });
    () => noSearch({ userId: 'hi' });
    // @ts-expect-error
    () => noSearch(5);
  };
});

it('should allow sideEffect overrides', () => {
  () => {
    const getEth = new RestEndpoint({
      urlPrefix: 'https://rpc.ankr.com',
      path: '/eth',
      method: 'POST',
      body: {} as {
        jsonrpc: string;
        id: number;
        method: string;
        params: any[];
      },
      pollFrequency: 30 * 1000,
      sideEffect: undefined,
    });
    const getEthExtend = new RestEndpoint({
      urlPrefix: 'https://rpc.ankr.com',
      path: '/eth',
      method: 'POST',
      body: {} as {
        jsonrpc: string;
        id: number;
        method: string;
        params: any[];
      },
      pollFrequency: 30 * 1000,
    }).extend({ sideEffect: undefined });

    const a: undefined = getEth.sideEffect;
    const b: undefined = getEthExtend.sideEffect;
    () => {
      const ctrl = useController();
      ctrl.fetch(getEth, {
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getBlockByNumber',
        params: ['latest', true],
      });
      useSuspense(getEth, {
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getBlockByNumber',
        params: ['latest', true],
      });
      // @ts-expect-error
      ctrl.fetch(getEth, {
        id: 1,
        method: 'eth_getBlockByNumber',
        params: ['latest', true],
      });
      // @ts-expect-error
      useSuspense(getEth, {
        id: 1,
        method: 'eth_getBlockByNumber',
        params: ['latest', true],
      });
      // @ts-expect-error
      useSuspense(getEth, {
        jsonrpc: '2.0',
        id: 1,
        method: 6,
        params: ['latest', true],
      });
      useSuspense(
        getEth,
        // @ts-expect-error
        {},
        {
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_getBlockByNumber',
          params: ['latest', true],
        },
      );
    };
    () => {
      const ctrl = useController();
      ctrl.fetch(getEthExtend, {
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getBlockByNumber',
        params: ['latest', true],
      });
      useSuspense(getEthExtend, {
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getBlockByNumber',
        params: ['latest', true],
      });
      // @ts-expect-error
      ctrl.fetch(getEthExtend, {
        id: 1,
        method: 'eth_getBlockByNumber',
        params: ['latest', true],
      });
      // @ts-expect-error
      useSuspense(getEthExtend, {
        id: 1,
        method: 'eth_getBlockByNumber',
        params: ['latest', true],
      });
      // @ts-expect-error
      useSuspense(getEthExtend, {
        jsonrpc: '2.0',
        id: 1,
        method: 6,
        params: ['latest', true],
      });
      useSuspense(
        getEthExtend,
        // @ts-expect-error
        {},
        {
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_getBlockByNumber',
          params: ['latest', true],
        },
      );
    };
  };
});

it('should handle more open ended type definitions', () => {
  () => {
    const unknownParams = new RestEndpoint({
      path: '' as `${string}:${string}`,
    });

    unknownParams({ hi: 5 });
    unknownParams();
    // @ts-expect-error
    unknownParams(5);

    const explicit: GetEndpoint<{
      path: `${string}:${string}`;
      schema: schema.Collection<[typeof User]>;
    }> = new RestEndpoint({
      path: '' as `${string}:${string}`,
      schema: new schema.Collection([User]),
    });
    explicit({ hi: 5 });
    explicit.push.process({} as any, { hi: 5 });
    explicit.push();
  };
});

() => {
  const getThing = new RestEndpoint({
    path: '/:id*:bob',
  });

  getThing({ id: 5, bob: 'hi' });
  // @ts-expect-error
  getThing({ id: 'hi' });
  // @ts-expect-error
  getThing({ bob: 'hi' });
  // @ts-expect-error
  getThing(5);
};
() => {
  const getThing = new RestEndpoint({
    path: '/:id+:bob',
  });

  getThing({ id: 5, bob: 'hi' });
  // @ts-expect-error
  getThing({ 'id+': 5, bob: 'hi' });
  // @ts-expect-error
  getThing({ id: 'hi' });
  // @ts-expect-error
  getThing({ bob: 'hi' });
  // @ts-expect-error
  getThing(5);
};
() => {
  const getThing = new RestEndpoint({
    path: '/:id\\+:bob',
  });

  getThing({ id: 5, bob: 'hi' });
  // @ts-expect-error
  getThing({ 'id+': 5, bob: 'hi' });
  // @ts-expect-error
  getThing({ id: 'hi' });
  // @ts-expect-error
  getThing({ bob: 'hi' });
  // @ts-expect-error
  getThing(5);
};
() => {
  const getThing = new RestEndpoint({
    path: '/:id:bob+',
  });

  getThing({ id: 5, bob: 'hi' });
  // @ts-expect-error
  getThing({ id: 5, 'bob+': 'hi' });
  // @ts-expect-error
  getThing({ id: 'hi' });
  // @ts-expect-error
  getThing({ bob: 'hi' });
  // @ts-expect-error
  getThing(5);
};
() => {
  const getThing = new RestEndpoint({
    path: '/:foo/(.*)',
  });

  getThing({ foo: 'hi' });
  // @ts-expect-error
  getThing({});
  // @ts-expect-error
  getThing({ id: 'hi' });
  // @ts-expect-error
  getThing(5);
};
() => {
  const getThing = new RestEndpoint({
    path: '/:attr1?{-:attr2}?{-:attr3}?',
  });

  getThing({ attr1: 'hi' });
  getThing({ attr2: 'hi' });
  getThing({ attr3: 'hi' });
  getThing({ attr1: 'hi', attr3: 'ho' });
  getThing({ attr2: 'hi', attr3: 'ho' });
  getThing({});
  // @ts-expect-error
  getThing({ random: 'hi' });
  // @ts-expect-error
  getThing(5);
};

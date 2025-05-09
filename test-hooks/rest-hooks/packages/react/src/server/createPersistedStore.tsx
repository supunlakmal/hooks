'use client';
import {
  Controller,
  Manager,
  NetworkManager,
  State,
  initialState,
  createReducer,
  applyManager,
  initManager,
} from '@data-client/core';
import { useSyncExternalStore } from 'react';

import { PromiseifyMiddleware } from './redux/index.js';
import { createStore, applyMiddleware } from './redux/redux.js';
import SSRDataProvider from './SSRDataProvider.js';
import { NetworkManager as ReactNetworkManager } from '../managers/index.js';

export default function createPersistedStore(
  managers?: Manager[],
  hasDevManager: boolean = true,
) {
  const controller = new Controller();
  managers = managers ?? [new ReactNetworkManager()];
  const networkManager: NetworkManager = managers.find(
    m => m instanceof NetworkManager,
  ) as any;
  if (networkManager === undefined)
    throw new Error('managers must include a NetworkManager');
  const reducer = createReducer(controller);
  const enhancer = applyMiddleware(
    // redux 5's types are wrong and do not allow any return typing from next, which is incorrect.
    // `next: (action: unknown) => unknown`: allows any action, but disallows all return types.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ...applyManager(managers, controller),
    PromiseifyMiddleware,
  );
  const store = createStore(reducer, initialState as any, enhancer);
  initManager(managers, controller, store.getState())();

  const selector = (state: any) => state;

  const getState = () => selector(store.getState());
  let firstRender = true;
  function useReadyCacheState(): State<unknown> {
    const inFlightFetches = networkManager.allSettled();
    if (inFlightFetches) {
      firstRender = false;
      throw inFlightFetches;
    }
    if (firstRender) {
      firstRender = false;
      throw new Promise(resolve => setTimeout(resolve, 10));
    }
    return useSyncExternalStore(store.subscribe, getState, getState);
  }

  function ServerDataProvider({ children }: { children: React.ReactNode }) {
    return (
      <SSRDataProvider
        getState={store.getState}
        subscribe={store.subscribe}
        dispatch={store.dispatch}
        hasDevManager={hasDevManager}
      >
        {children}
      </SSRDataProvider>
    );
  }
  return [ServerDataProvider, useReadyCacheState, controller, store] as const;
}

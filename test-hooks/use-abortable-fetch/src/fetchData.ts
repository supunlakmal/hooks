import { Dispatch, SetStateAction } from 'react';

import { FetchState } from './types';
import isJSON from './isJSON';

const fetchData = async <T>(
  url: string,
  init: RequestInit = {},
  controller: AbortController,
  setState: Dispatch<SetStateAction<FetchState<T>>>
): Promise<void> => {
  const actualInit: RequestInit = { ...init, signal: controller.signal };

  let rsp: Response | null = null;
  try {
    setState(
      (oldState: FetchState<T>): FetchState<T> => ({
        data: null,
        loading: oldState.loading + 1,
        error: null,
        controller
      })
    );

    rsp = await fetch(url, actualInit);
    const contentTypeHeader = rsp.headers.get('content-type');

    if (contentTypeHeader) {
      let data: T | string | null = null;

      if (isJSON(contentTypeHeader)) {
        data = await rsp.json();
      } else {
        data = await rsp.text();
      }
      setState(
        (oldState: FetchState<T>): FetchState<T> => ({
          ...oldState,
          data,
          loading: oldState.loading - 1
        })
      );
    } else {
      setState(
        (oldState: FetchState<T>): FetchState<T> => ({
          ...oldState,
          loading: oldState.loading - 1
        })
      );
    }

    if (!rsp.ok) {
      const err: any = new Error(rsp.statusText);
      err.status = rsp.status;
      throw err;
    }
  } catch (e) {
    const err: Error = e;

    const error = err.name !== 'AbortError' ? err : null;

    setState(
      (oldState: FetchState<T>): FetchState<T> => ({
        ...oldState,
        error,
        // Only decrease the loading counter if there is no repsonse
        loading: rsp ? oldState.loading : oldState.loading - 1
      })
    );
  }
};

export default fetchData;

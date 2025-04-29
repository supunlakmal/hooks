// src/hooks/useFusionTable.ts
import useAntdTable from '../useAntdTable';
import type { Data, Params, Service } from '../useAntdTable/types';
import { fieldAdapter, resultAdapter } from './fusionAdapter';
import type { FusionTableOptions, FusionTableResult } from './types';

const useFusionTable = <TData extends Data, TParams extends Params>(
  service: Service<TData, TParams>,
  options: FusionTableOptions<TData, TParams> = {},
): FusionTableResult<TData, TParams> => {
  const ret = useAntdTable<TData, TParams>(service, {
    ...options,
    form: options.field ? fieldAdapter(options.field) : undefined,
  });

  return resultAdapter(ret);
};

export default useFusionTable;

// src/hooks/fusionAdapter.ts
import { FormInstance } from 'antd';
import type { Data, Field, Params } from '../useAntdTable/types';
import type { FusionTableResult } from './types';

export const fieldAdapter = <TData extends Data, TParams extends Params>(
  field: string | string[],
) => {
  return (form: FormInstance) => {
    return field.reduce((pre, cur) => {
      const val = form.getFieldValue(cur);
      if (val !== undefined) {
        pre[cur] = val;
      }
      return pre;
    }, {} as Field);
  };
};

export const resultAdapter = <TData extends Data, TParams extends Params>(
  result: any,
): FusionTableResult<TData, TParams> => {
  return result;
};
// src/hooks/types.ts
import type { FormInstance } from 'antd';
import type { Data, Field, Params, Result } from '../useAntdTable/types';

export type FusionTableOptions<TData extends Data, TParams extends Params> = {
  field?: string | string[];
};

export type FusionTableResult<TData extends Data, TParams extends Params> = Result<
  TData,
  TParams,
  FormInstance
>;
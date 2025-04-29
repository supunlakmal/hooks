// src/hooks/useFusionTable.ts
import type { FormInstance } from 'antd';
import useAntdTable from '../useAntdTable';
import type { Service, Result } from '../useAntdTable/types';
import { fieldAdapter, resultAdapter } from './fusionAdapter';


export type Data = Record<string, any>;
export type Params = any[];

export type FusionTableOptions<TData extends Data, TParams extends Params> = {
  field?: string | string[];
};

export type FusionTableResult<TData extends Data, TParams extends Params> = Result<
  TData,
  TParams,
  FormInstance
>;

const useFusionTable = <TData extends Data, TParams extends Params>(
  service: Service<TData, TParams>,
  options: FusionTableOptions<TData, TParams> = {},
): FusionTableResult<TData, TParams> => {
  const ret = useAntdTable<TData, TParams, FormInstance>(service, {
    ...options,
    form: options.field ? fieldAdapter(options.field) : undefined,
  });

  return resultAdapter(ret);
};

export default useFusionTable;

// src/hooks/fusionAdapter.ts
import type { FormInstance } from 'antd';

export type Data = Record<string, any>;
export type Field = Record<string, any>;
export type Params = any[];
export type FusionTableResult<TData extends Data, TParams extends Params> = any;

export const fieldAdapter = <TData extends Data, TParams extends Params, FormInstance>(
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

export const resultAdapter = <TData extends Data, TParams extends Params, FormInstance>(
  result: any,
): FusionTableResult<TData, TParams> => {
  return result;
};
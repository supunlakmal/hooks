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
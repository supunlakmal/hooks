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
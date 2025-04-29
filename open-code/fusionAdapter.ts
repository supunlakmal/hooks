import { FormInstance } from 'antd';

export type Data = Record<string, any>;
export type Field = Record<string, any>;
export type Params = Record<string, any>;

export type FusionTableResult<
  TData extends Data,
  TParams extends Params,
> = any;

export const fieldAdapter = <TData extends Data, TParams extends Params>(
  field: string | string[],
) => {
  return (form: FormInstance) => {
    return field.reduce((pre, cur) => {
      const fieldValue = form.getFieldValue(cur);

      if (fieldValue !== undefined) {
        pre[cur] = fieldValue;
      }
      return pre;
    }, {} as Field);
  };
};

export const resultAdapter = <TData extends Data, TParams extends Params>(
  result: FusionTableResult<TData, TParams>,
): FusionTableResult<TData, TParams> => {
  return result;
};
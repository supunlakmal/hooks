import { useController } from '@data-client/react';
import { styled } from '@linaria/react';
import { memo, useCallback } from 'react';
import { TodoResource } from 'resources/TodoResource';

function NewTodo({ userId }: { userId?: number }) {
  const ctrl = useController();

  const handlePress = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        ctrl.fetch(TodoResource.getList.push, {
          userId,
          title: e.currentTarget.value,
        });
        e.currentTarget.value = '';
      }
    },
    [ctrl, userId],
  );

  return (
    <TodoBox>
      <input type="checkbox" name="new" checked={false} disabled />{' '}
      <TitleInput type="text" onKeyDown={handlePress} />
    </TodoBox>
  );
}
export default memo(NewTodo);

const TodoBox = styled.div`
  text-align: left;
  display: flex;
`;
const TitleInput = styled.input`
  flex: 1 1 auto;
  width: 100%;
  background: #efefef;
  opacity: 0.5;
  &:focus,
  &:hover {
    opacity: 1;
  }
`;

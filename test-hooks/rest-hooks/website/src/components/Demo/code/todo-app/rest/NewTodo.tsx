import { TodoResource } from './resources';

export default function NewTodo({ userId }: { userId: number }) {
  const controller = useController();
  const handleKeyDown = async e => {
    if (e.key === 'Enter') {
      controller.fetch(TodoResource.getList.push, {
        userId,
        title: e.currentTarget.value,
      });
      e.currentTarget.value = '';
    }
  };
  return (
    <div className="listItem nogap">
      <label>
        <input type="checkbox" name="new" checked={false} disabled />
        <TextInput size="small" onKeyDown={handleKeyDown} />
      </label>
      <CancelButton />
    </div>
  );
}

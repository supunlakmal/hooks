import { UserResource, type Post } from './resources';

export default function PostItem({ post }: { post: Post }) {
  const author = useSuspense(UserResource.get, { id: post.userId });
  return (
    <div className="listItem spaced">
      <Avatar src={author.profileImage} />
      <div>
        <h4>{post.title}</h4>
        <small>by {author.name}</small>
      </div>
    </div>
  );
}

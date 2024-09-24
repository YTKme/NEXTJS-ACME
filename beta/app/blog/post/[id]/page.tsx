/**
 * Post [ID]
 */

import Post from '@/app/interface/component/post/post';
import { postList } from '@/app/library/placeholder-data';

export default function Page({
  params
}: {
  params: { id: string }
}) {
  const post = postList.find(
    (post) => post.id === params.id
  );

  return (
    <>
      <h1>Post</h1>
      <Post {...post} />
    </>
  );
}

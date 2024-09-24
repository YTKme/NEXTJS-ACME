/**
 * Post Page
 */

import Post from '@/app/interface/component/post/post';
import { postList } from '@/app/library/placeholder-data';

export default function Page() {
  return (
    <>
      <h1>Posts</h1>
      {
        postList.map(
          (post) => <Post key={post.id} {...post} />
        )
      }
    </>)
}

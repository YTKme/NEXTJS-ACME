/**
 * Post Page
 */

import { Button } from '@/app/interface/component/button';
import Post from '@/app/interface/component/post/post';
import { getPost } from '@/app/library/data';
import Link from 'next/link';
// import { postList } from '@/app/library/placeholder-data';

export default async function Page() {
  const postList = await getPost();

  return (
    <>
      <Link href="/blog/post/create">
        <Button className="outline outline-1  border-purple-700 text-purple-700 hover:bg-purple-700 hover:text-white my-5 py-2 px-4 rounded">New +</Button>
      </Link>
      <h1>Posts</h1>
      {
        postList?.map(
          (post) => <Post key={post.id} {...post} />
        )
      }
    </>)
};

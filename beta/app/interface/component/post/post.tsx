/**
 * Post Component
 */

import Link from "next/link";


export default function Component({
  id, title, content, date
}: {
  id: string, title: string, content: string, date: string
}) {
  return (
    <div key={id} className="border border-gray-200 p-4 my-4">
      <h2><Link href={`/blog/post/${id}`}>{title}</Link></h2>
      <p className="text-gray-500">{date}</p>
      <p>{content}</p>
    </div>
  );
}

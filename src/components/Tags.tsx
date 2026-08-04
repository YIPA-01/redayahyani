// Its own module so the articles index can render tags without importing
// ArticleLayout, which pulls in the fast-glob backed article list.
export function Tags({ tags }: { tags: Array<string> }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
        >
          {tag}
        </li>
      ))}
    </ul>
  )
}

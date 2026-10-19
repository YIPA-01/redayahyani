import { type Metadata } from 'next'
import Image from 'next/image'

import { SimpleLayout } from '@/components/SimpleLayout'
import { ogImageUrl } from '@/lib/siteUrl'

interface Book {
  title: string
  author: string
  cover: string
}

// Covers live in public/library/. Craft first, then everything else.
const books: Array<Book> = [
  {
    title: 'The Basics of User Experience Design',
    author: 'Interaction Design Foundation',
    cover: '/library/the-basics-of-user-experience-design.webp',
  },
  {
    title: 'Python for Data Analysis',
    author: 'Wes McKinney',
    cover: '/library/python-for-data-analysis.jpg',
  },
  {
    title: 'The Laravel Survival Guide',
    author: 'DevDojo',
    cover: '/library/the-laravel-survival-guide.jpeg',
  },
  {
    title: 'Never Split the Difference',
    author: 'Chris Voss',
    cover: '/library/never-split-the-difference.jpg',
  },
  {
    title: '1984',
    author: 'George Orwell',
    cover: '/library/1984.webp',
  },
  {
    title: 'The Brothers Karamazov I, II, III, IV',
    author: 'Fyodor Dostoevsky',
    cover: '/library/the-brothers-karamazov.webp',
  },
  {
    title: 'Immortality',
    author: 'Milan Kundera',
    cover: '/library/immortality.jpg',
  },
  {
    title: 'Imperialism, the Highest Stage of Capitalism',
    author: 'Vladimir Lenin',
    cover: '/library/imperialism.jpg',
  },
]

function BookEntry({ title, author, cover }: Book) {
  return (
    <li>
      <figure>
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg border border-line bg-panel">
          <Image
            src={cover}
            alt={`Cover of ${title}`}
            fill
            sizes="(min-width: 1024px) 14rem, (min-width: 640px) 30vw, 45vw"
            className="object-cover"
          />
        </div>
        <figcaption className="mt-4">
          <div className="text-sm font-medium text-ink">{title}</div>
          <div className="mt-1 text-sm text-muted">{author}</div>
        </figcaption>
      </figure>
    </li>
  )
}

const description = 'Books I have read and keep coming back to.'

export const metadata: Metadata = {
  title: 'Library',
  description,
  openGraph: {
    title: 'Library',
    description,
    type: 'website',
    images: [ogImageUrl({ title: 'Library', eyebrow: 'Reda Yahyani' })],
  },
}

export default function Library() {
  return (
    <SimpleLayout
      title="Books I have read and keep coming back to."
      intro="Some of these sharpen the work: design, data, and the frameworks I build with. The rest are novels and political writing, which shape how I think about the people I build for."
    >
      <ul
        role="list"
        className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-4"
      >
        {books.map((book) => (
          <BookEntry key={book.title} {...book} />
        ))}
      </ul>
    </SimpleLayout>
  )
}

import { type Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import { RoleSplit } from '@/components/sections/RoleSplit'
import { GitHubIcon, LinkedInIcon, XIcon } from '@/components/SocialIcons'
import portraitImage from '@/images/portrait.jpg'

function SocialLink({
  className,
  href,
  children,
  icon: Icon,
}: {
  className?: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <li className={clsx(className, 'flex')}>
      <Link
        href={href}
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-coral-text dark:text-zinc-200 dark:hover:text-coral-text"
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-accent-500" />
        <span className="ml-4">{children}</span>
      </Link>
    </li>
  )
}

function MailIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
      />
    </svg>
  )
}

export const metadata: Metadata = {
  title: 'About',
  description:
    'I’m Reda Yahyani, a product engineer in Agadir, Morocco. I design and build web products end to end, starting from the people who use them.',
}

export default function About() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        <div className="lg:pl-20">
          <div className="max-w-xs px-2.5 lg:max-w-none">
            <Image
              src={portraitImage}
              alt=""
              sizes="(min-width: 1024px) 32rem, 20rem"
              className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
            />
          </div>
        </div>
        <div className="lg:order-first lg:row-span-2">
          <h1 className="text-balance text-4xl font-medium tracking-tight text-ink sm:text-5xl">
            I’m Reda Yahyani. I build products from the user inward.
          </h1>
          <div className="mt-6 space-y-7 text-base text-muted">
            <p>
              I once spent three months on a support line for medical diagnostic
              equipment, solving technical problems for the people using it.
              That is where I learned that most technical problems are really
              problems of understanding, and that the fix starts with what the
              person in front of you is trying to do.
            </p>
            <p>
              Since 2024 I have designed and built web products end to end for
              clients, first on my own and now with Exploda, a design and
              development agency. I take a product from the first flow sketch to
              the database underneath it. On the side I build Roomee, a rental
              marketplace that helps students in Morocco find rooms they can
              actually afford.
            </p>
            <p>
              I studied Computer Systems Engineering at Supmti and work from
              Agadir, Morocco, with clients anywhere.
            </p>
            <p>
              Away from the terminal I write poetry. It lives on its own page,{' '}
              <Link
                href="/writing"
                className="font-medium text-coral-text transition hover:text-accent-600 dark:hover:text-accent-400"
              >
                here
              </Link>
              .
            </p>
          </div>
        </div>
        <div className="lg:pl-20">
          <ul role="list">
            <SocialLink href="https://x.com/RYahyani19872" icon={XIcon}>
              Follow on X
            </SocialLink>
            <SocialLink
              href="https://github.com/YIPA-01"
              icon={GitHubIcon}
              className="mt-4"
            >
              Follow on GitHub
            </SocialLink>
            <SocialLink
              href="https://www.linkedin.com/in/reda-yahyani"
              icon={LinkedInIcon}
              className="mt-4"
            >
              Follow on LinkedIn
            </SocialLink>
            <SocialLink
              href="mailto:yahyanireda@gmail.com"
              icon={MailIcon}
              className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
            >
              yahyanireda@gmail.com
            </SocialLink>
          </ul>
        </div>
      </div>
      <div className="mt-24 sm:mt-32">
        <RoleSplit />
      </div>
    </Container>
  )
}

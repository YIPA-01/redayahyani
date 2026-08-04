import rehypePrism from '@mapbox/rehype-prism'
import nextMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  // Lets a production build run without clobbering the .next a dev server is
  // using. Set NEXT_DIST_DIR to build somewhere else.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // /projects became /work when the project list turned into case studies.
  // Kept so anything already linking to the old namespace still lands.
  async redirects() {
    return [
      { source: '/projects', destination: '/work', permanent: true },
      { source: '/projects/:slug', destination: '/work/:slug', permanent: true },
    ]
  },
}

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypePrism],
  },
})

export default withMDX(nextConfig)

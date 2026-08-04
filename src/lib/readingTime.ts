import { Children, isValidElement, type ReactNode } from 'react'

const WORDS_PER_MINUTE = 220

// Walks the rendered tree rather than the MDX source, so no article has to
// declare a word count and the number cannot drift from the prose. Runs
// synchronously during render, which means server and client agree and the
// byline never flickers.
function countWords(node: ReactNode): number {
  if (node === null || node === undefined || typeof node === 'boolean') return 0

  if (typeof node === 'string') {
    const trimmed = node.trim()
    return trimmed ? trimmed.split(/\s+/).length : 0
  }

  if (typeof node === 'number') return 1

  if (Array.isArray(node)) {
    return node.reduce((total, child) => total + countWords(child), 0)
  }

  if (isValidElement(node)) {
    const children = (node.props as { children?: ReactNode }).children
    return Children.toArray(children).reduce<number>(
      (total, child) => total + countWords(child),
      0,
    )
  }

  return 0
}

export function readingTime(node: ReactNode) {
  const words = countWords(node)
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}

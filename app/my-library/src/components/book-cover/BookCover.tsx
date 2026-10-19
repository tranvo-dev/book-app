import { useState } from 'react'
import type { CoverTokens } from '../../theme/opalite/tokens.ts'
import './BookCover.scss'

type CoverSize = 'sm' | 'md'

export type BookCoverProps = {
  /** Used to pick a color that never changes for this book. */
  bookId: string
  title: string
  /** Real cover image; the initials are shown if missing or broken. */
  coverUrl?: string | null
  /**
   * sm = 44px wide (mobile list), md = 56px wide (desktop list).
   * Leave unset to switch automatically (sm at 600px and below).
   */
  size?: CoverSize
}

const COVER_KEYS: (keyof CoverTokens)[] = ['c1', 'c2', 'c3', 'c4', 'c5']

/** Same id → same color every time (no Math.random). */
function coverColorKey(bookId: string): keyof CoverTokens {
  let hash = 0
  for (const ch of bookId) hash = (hash * 31 + ch.codePointAt(0)!) | 0
  return COVER_KEYS[Math.abs(hash) % COVER_KEYS.length]
}

const getInitials = (title: string): string => {
  return title.substring(0, 2).toLocaleUpperCase()
}

export function BookCover({ bookId, title, coverUrl, size }: BookCoverProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const initials = getInitials(title)
  const showImage = Boolean(coverUrl) && !imageFailed

  const className = [
    'book-cover',
    `book-cover--${size ?? 'responsive'}`,
    `book-cover--${coverColorKey(bookId)}`,
    initials.length >= 4 && 'book-cover--long',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    // Decorative: the title is always shown next to the cover
    <div aria-hidden="true" className={className}>
      {showImage ? (
        <img
          className="book-cover-image"
          src={coverUrl!}
          alt=""
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      ) : (
        initials
      )}
    </div>
  )
}

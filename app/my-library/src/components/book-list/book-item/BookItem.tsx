import { Typography, useMediaQuery } from '@mui/material'
import './BookItem.scss'
import { BookCover } from '../../book-cover/BookCover.tsx'

interface BookProps {
  id: string
  title: string
}
function BookItem(props: BookProps) {
  const { id, title } = props
  // Same breakpoint as the SCSS (max-width: 600px)
  const isMobile = useMediaQuery('(max-width: 600px)')
  return (
    <div id={id} className="book-item-container">
      <BookCover bookId={id} title={title} />
      <div className="book-info">
        {isMobile ? (
          <Typography variant="h5" component="span" className="book-title">
            {title}
          </Typography>
        ) : (
          <Typography variant="h3">{title}</Typography>
        )}
      </div>
    </div>
  )
}

export default BookItem

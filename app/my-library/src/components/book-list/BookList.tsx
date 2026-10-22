import './BookList.scss'
import EmptyState from './empty-state/EmptyState.tsx'
import BookItem from './book-item/BookItem.tsx'
import type { Book } from '../../models/Book.ts'
import { Typography } from '@mui/material'
import StatusFilter from './status-filter/StatusFilter.tsx'
import { StatusFilterOption } from './status-filter/StatusFilterOption.ts'
import SearchInput from './search-input/SearchInput.tsx'

interface BookListProps {
  books: Book[]
}

export function BookList(props: BookListProps) {
  const { books } = props

  if (books.length == 0) {
    return <EmptyState />
  } else {
    const bookItems = books.map((book) => (
      <BookItem key={book.id} id={book.id} title={book.title} />
    ))
    return (
      <>
        <div className="book-list-title">
          <Typography variant="h2">Your library</Typography>
          {/*TODO integrate with the backend*/}
          <StatusFilter defaultSelectedStatus={StatusFilterOption.ALL} handleFilter={() => {}} />
        </div>

        {/*TODO integrate with the backend*/}
        <SearchInput searchValue={''} handleSearch={() => {}} />
        <>{bookItems}</>
      </>
    )
  }
}

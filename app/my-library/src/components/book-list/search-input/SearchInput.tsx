import { TextField } from '@mui/material'
import * as React from 'react'
import './SearchInput.scss'
import { useState } from 'react'

interface SearchFilterProps {
  searchValue: string | null
  handleSearch: (searchValue: string | null) => void
}

function SearchInput(props: SearchFilterProps) {
  const [searchValue, setSearchValue] = useState(props.searchValue)
  const onSearchInputChanged = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setSearchValue(event.target.value)
    props.handleSearch(searchValue)
  }
  return (
    <>
      <div className="book-list-search">
        <TextField
          id="outlined-basic"
          placeholder="Search by title or author"
          variant="outlined"
          value={searchValue}
          onChange={onSearchInputChanged}
        />
      </div>
    </>
  )
}

export default SearchInput

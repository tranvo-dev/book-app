import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import * as React from 'react'
import { useState } from 'react'
import './StatusFilter.scss'
import { StatusFilterOption } from './StatusFilterOption'

interface StatusFilterProps {
  defaultSelectedStatus: StatusFilterOption
  handleFilter: (status: StatusFilterOption) => void
}

function StatusFilter(props: StatusFilterProps) {
  const [selectedStatus, setSelectedStatus] = useState(props.defaultSelectedStatus)
  const statusFilterOptions = Object.values(StatusFilterOption).map((key) => {
    return (
      <ToggleButton key={key} className="book-filter__child" value={key}>
        {key}
      </ToggleButton>
    )
  })
  const handleFilter = (
    _event: React.MouseEvent<HTMLElement>,
    selectedStatus: StatusFilterOption | null,
  ) => {
    // Exclusive groups send null when the selected button is clicked again
    if (selectedStatus === null) return
    setSelectedStatus(selectedStatus)
    props.handleFilter(selectedStatus)
  }
  return (
    <ToggleButtonGroup
      className="book-filter"
      value={selectedStatus}
      exclusive
      onChange={handleFilter}
      aria-label="Filter books by status"
    >
      {statusFilterOptions}
    </ToggleButtonGroup>
  )
}

export default StatusFilter

import { Typography } from '@mui/material'
import EmptyBookShelfSvg from '../../../assets/empty-bookshelf.svg?react'
import './EmptyState.scss'
import { FileUpload } from '../../file-upload/FileUpload.tsx'

function EmptyState() {
  return (
    <div className="empty-book-list">
      <EmptyBookShelfSvg />
      <div className="empty-statement">
        <Typography variant="h2">Your shelf is empty</Typography>
        <div>
          Upload a PDF and we will keep your place, show how much of it you have read, and count
          your reading days.
        </div>
      </div>
      <FileUpload />
    </div>
  )
}

export default EmptyState

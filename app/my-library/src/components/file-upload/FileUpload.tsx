import { Box, Button, LinearProgress, Typography } from '@mui/material'
import { useRef, useState } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import './FileUpload.scss'
import * as React from 'react'
import { BookCover } from '../book-cover/BookCover.tsx'

interface FileUploadProps {
  isMultiple?: boolean
}

export function FileUpload(props: FileUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }

  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFiles(Array.from(e.dataTransfer.files as FileList))
      e.dataTransfer.clearData()
    }
  }

  // Handle file picker selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(Array.from(e.target.files))
    }
  }

  const onButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <Box
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`file-upload-container ${isDragActive ? 'drag-active-bg' : ''} `}
      >
        <Button
          className="upload-button"
          component="label"
          role={undefined}
          variant="contained"
          startIcon={<CloudUploadIcon />}
          tabIndex={-1}
        >
          Upload your first book
        </Button>
        <div>or drop a PDF here · PDF only, up to [MAX FILE SIZE]</div>
        <input
          ref={fileInputRef}
          type="file"
          multiple={props.isMultiple}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </Box>
      {files.length > 0 &&
        files.map((file: File, index: number) => (
          <div key={index} className="selected-file-container">
            <div className="selected-file-info">
              <BookCover size="sm" bookId={index.toString()} title={file.name} />
              <Typography variant={'h5'} component={'span'}>
                {file.name}
              </Typography>
            </div>
            <Box sx={{ width: '100%' }}>
              <LinearProgress aria-label="Loading…" />
            </Box>
          </div>
        ))}
    </>
  )
}

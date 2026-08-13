# 0010. Google Cloud Storage for attachments, with duplicate-content handling

- Status: Accepted
- Date: 2026-06-08
- Scope: book-core-service

## Context

Book attachments (e.g. cover images, files) need durable object storage outside
the relational DB, plus content-type detection independent of client-supplied
(and possibly wrong) `Content-Type` headers. Uploading the same file content twice
should not be treated as an unhandled server error.

## Decision

Store attachments in Google Cloud Storage via Spring Cloud GCP
(`GoogleCloudStorageConfig`, `GcsUploadService`), detect actual content type with
Apache Tika instead of trusting client headers, and raise a dedicated
`FileUploadException` (handled by `GlobalExceptionHandler`) when an upload
duplicates existing content, instead of letting a storage-level conflict surface
as a generic 500.

## Consequences

- Attachment storage is decoupled from the primary Postgres DB and scales
  independently.
- Content-type detection is consistent regardless of what the client claims.
- Duplicate-content uploads get a clear, typed error response instead of an
  opaque failure.

## References

- Commit: `d0609aa` — feat: handle upload duplicated content
- Commit: `8881ff0` — feat: init project
- README.md § book-core-service extras (Cloud Storage, File Processing)

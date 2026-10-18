# 0014. Use Cloudinary instead of Google Cloud Storage for attachments

- Status: Accepted
- Date: 2026-10-18
- Scope: book-core-service

## Context

[0010](0010-gcs-storage-with-dedup-upload.md) stored book attachments in Google
Cloud Storage. GCS needs a GCP project, billing and service-account credentials,
even to run the service locally. We also need a simple way to download a file
back for its owner (`GET` download book API), not just upload it.

## Decision

Store attachments in Cloudinary through the `cloudinary-http5` SDK:

- `CloudinaryConfig` builds the `Cloudinary` client from `cloudinary.cloud-name`,
  `cloudinary.api-key` and `cloudinary.api-secret`.
- `CloudinaryFileUploadService` uploads each file into a folder named after the
  user's `sub`. The returned `asset_id` and `display_name` are saved on the book.
- `CloudinaryFileDownloadService` creates a signed private download URL and
  streams the file back to the client.
- `GoogleCloudStorageConfig` and `GcsUploadService` are removed.

## Alternatives considered

- **Keep GCS** — works, but needs GCP setup and credentials for every
  environment, including local.

## Consequences

- Setup is just three config values; no GCP project needed.
- Files are grouped per user (`<sub>/...`), which matches the owner check on
  download.
- The duplicate-content handling from 0010 is gone; uploading the same file
  twice now creates a second book.
- Follow-ups:
  - Remove the unused Spring Cloud GCP dependencies from `pom.xml`.
  - Download hard-codes format `pdf` and `resource_type` `image`; other file
    types need handling.
  - Apache Tika is still a dependency but no longer used for content-type
    detection.

## References

- Commit: `597a7f2` — feat: switch storage to Cloudinary and create users only on /users/me
- Supersedes [0010](0010-gcs-storage-with-dedup-upload.md)

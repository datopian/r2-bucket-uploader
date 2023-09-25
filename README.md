# Cloudflare R2 bucket File Uploader

A minimal and flexible uploader component tailored for Cloudflare R2 bucket. Fully compatible with [PortalJS](https://portaljs.org/).

<img width="1080" alt="r2-bucket-uploader" src="https://github.com/datopian/r2-bucket-uploader/assets/17809581/28028669-eec4-4c4b-b05f-56cd20d410d8">

The intent of this repo is to provide simple to use and simple to copy and paste file uploader component for Next.js.

The file uploader components use [Uppy](https://uppy.io/) under the hood and are accompanied by the necessary API routes.

The components were written mainly to be used with R2 but any blob storage with a S3-compatible API should work with just a few tweaks.

Good for simple projects or for bootstrapping more complex file-uploading workflows when customized.

## Features

- R2 blob storage support
- File content hashing
- Drag and drop
- URL pre-signing
- Multipart upload support
- Customizable

## Setup

This repo provides two different sets of component and API routes, one for simple uploads and the other for multipart uploads. If your application is meant to handle large files, multipart upload is the recommended approach. Choose one and follow the instructions below.

### Install the dependencies

On your project, run:

```bash
npm i @uppy/core @uppy/react @uppy/aws-s3 @uppy/dashboard @uppy/drag-drop @uppy/progress-bar @uppy/file-input crypto-hash @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

If you want to use the multipart upload component, one more dependency is required:

```bash
npm i @uppy/aws-s3-multipart
```

### Copy the component and the API routes into your project

#### Simple upload

Copy the following file to the components folder of your project:

https://github.com/datopian/r2-bucket-uploader/blob/main/components/FileUploader.tsx

Next, copy the following file into your project's `pages/api/` folder:

https://github.com/datopian/r2-bucket-uploader/blob/main/pages/api/upload.ts

#### Multipart upload

Copy the following file to the components folder of your project:

https://github.com/datopian/r2-bucket-uploader/blob/main/components/MultipartFileUploader.tsx

Next, copy the following folder into your project's `pages/api/` folder:

https://github.com/datopian/r2-bucket-uploader/blob/main/pages/api/multipart-upload

### Set the environment variables

In your `.env` file, set the following environment variables:

```bash
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_KEY_ID=
R2_BUCKET_NAME=
```

The values should be available from the R2 management dashboard on Cloudflare.

### Set the CORS settings for the R2 bucket

Create the following CORS settings in order to make the upload components work with your bucket:

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "PUT"],
    "AllowedHeaders": ["Authorization", "content-type"],
    "ExposeHeaders": ["ETag", "Location"],
    "MaxAgeSeconds": 3000
  },
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET"],
    "AllowedHeaders": ["*"]
  }
]
```

Optionally, to increase security you can also customize the `AllowedOrigins` properties.

### Use the component

Now you can import `<FileUploader />` or `<MultipartFileUploader />` anywhere in your project. E.g.:

```jsx
// pages/index.js
import FileUploader from "@components/FileUploader";
import MultipartFileUploader from "@components/MultipartFileUploader";

export default function Home() {
  return (
    <div>
      <h1>Upload an image:</h1>

      <FileUploader
        onUploadSuccess={(result) => alert(JSON.stringify(result))}
      />

      {/* OR */}

      <MultipartFileUploader
        onUploadSuccess={(result) => alert(JSON.stringify(result))}
      />
    </div>
  );
}
```

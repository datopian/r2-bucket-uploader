# Next.js File Uploader Component

The intent of this repo is to provide a simple to use and simple to copy and paste file uploader component for Next.js.

**Live demo:** 

## Features

- R2 blob storage support
- File content hashing
- Drag and drop
- URL pre-signing

## Setup

### Install the dependencies

On your project, run:

```bash
npm i @uppy/core @uppy/react @uppy/aws-s3 @uppy/dashboard @uppy/drag-drop @uppy/progress-bar @uppy/file-input crypto-hash @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### Copy the `<FileUploader />` component and the `sign-s3` route into your project

Copy https://github.com/datopian/nextjs-file-uploader/blob/main/components/FileUploader.tsx to the components folder of your project.

Next, copy https://github.com/datopian/nextjs-file-uploader/blob/main/pages/api/sign-s3.ts into your project's `pages/api/` folder.

### Set the environment variables

In your `.env` file, set the following environment variables:

```bash
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_KEY_ID=
R2_BUCKET_NAME=
```

### Use the component

Now you can import `<FileUploader />` anywhere in your project. E.g.:

```jsx
// pages/index.js
import FileUploader from "@components/FileUploader";

export default function Home() {
  return <div>
    <h1>Upload an image:</h1>
    <FileUploader onUploadSuccess={(result) => alert(JSON.stringify(result))} />  
  </div>
}
```

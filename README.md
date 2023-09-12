# Next.js File Uploader Component

**Live demo:** https://nextjs-file-uploader-example.vercel.app/

The intent of this repo is to provide a simple to use and simple to copy and paste file uploader component for Next.js.

The file uploader component uses [Uppy](https://uppy.io/) under the hood and is accompanied by an API route that handles URL signing.

It was written mainly to be used with R2 but any blob storage with a S3-compatible API should work with just a few tweaks.

Good for simple projects or for bootstrapping more complex file-uploading workflows when customized.

## Features

- R2 blob storage support
- File content hashing
- Drag and drop
- URL pre-signing
- Customizable

## Setup

### Install the dependencies

On your project, run:

```bash
npm i @uppy/core @uppy/react @uppy/aws-s3 @uppy/dashboard @uppy/drag-drop @uppy/progress-bar @uppy/file-input crypto-hash @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### Copy the `<FileUploader />` component and the `sign-s3` route into your project

Copy the following file to the components folder of your project:

https://github.com/datopian/nextjs-file-uploader/blob/main/components/FileUploader.tsx

Next, copy the following file into your project's `pages/api/` folder:

https://github.com/datopian/nextjs-file-uploader/blob/main/pages/api/sign-s3.ts

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

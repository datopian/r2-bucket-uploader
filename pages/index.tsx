import Head from "next/head";
import { FileUploader } from "../components/FileUploader";
import { MultipartFileUploader } from "../components/MultipartFileUploader";
import styles from "../styles/Home.module.css";


export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>R2 bucket File Uploader</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>Upload files to R2 bucket</h1>

        <p className={styles.description}>
          You can drag and drop file(s) or directories below to upload them into
          a blob storage bucket.
        </p>

        <div>
          <h3>Simple upload</h3>
          <FileUploader
            onUploadSuccess={(result) => console.log(JSON.stringify(result))}
          />
        </div>

        <hr />

        <div>
          <h3>Multipart upload</h3>
          <MultipartFileUploader
            onUploadSuccess={(result) => console.log(JSON.stringify(result))}
          />
        </div>
      </main>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }
        hr {
          margin: 50px 0 30px 0;
          width: 100%;
          opacity: 0.3;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
        button.uppy-u-reset.uppy-Dashboard-Item-action.uppy-Dashboard-Item-action--copyLink {
          color: #2275d7 !important;
          width: 86px;
        }
       button.uppy-u-reset.uppy-Dashboard-Item-action.uppy-Dashboard-Item-action--copyLink::before {
        content: "Copy link";
        display: inline;
        margin-right: 4px;
        font-size: 12px;
        text-transform: none;
        }
      `}</style>
    </div>
  );
}

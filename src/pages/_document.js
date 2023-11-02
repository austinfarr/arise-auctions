import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body style={{ margin: "0px", backgroundColor: "#f5f5f5" }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

/* overiding the default structure of html document with next js (optional file, use it to add extra html content) */

import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
   render() {
      return (
         <Html lang='en'>
         <Head />
         <body>
            {/* <div id='overlays' /> */}   {/* adding an extra element the body of the Document*/}
            <Main />
            <NextScript />
         </body>
         </Html>
      );
   }
}

export default MyDocument;
import Link from "next/link";
import Head from "next/head";

export default class Layout extends React.Component {
  render() {
    const { children, title } = this.props;
    return (
      <>
        <Head>
          <title>{title}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>

        <header>
          <Link href="/">
            <a>Podcasts</a>
          </Link>
        </header>

        {children}

        <footer>
          <h6>
            Dev with 💚 by <a href="http://www.sebastiancardoso.com">sc</a>
          </h6>
        </footer>

        <style jsx>{`
          header {
            color: #fff;
            background: #8756ca;
            padding: 15px;
            text-align: center;
          }
          header a {
            color: #fff;
            text-decoration: none;
          }
          footer {
            display: flex;
            justify-content: center;
          }
        `}</style>

        <style jsx global>{`
          body {
            backcground-color: white;
            font-family: system-ui;
            margin: 0;
          }
        `}</style>
      </>
    );
  }
}

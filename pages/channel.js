import "isomorphic-fetch";
import Link from "next/link";
import Error from "./_error";
import Layout from "../components/Layout";
import ChannelGrid from "../components/ChannelGrid";
import PodcastList from "../components/PodcastsList";

export default class extends React.Component {

  constructor(props) {
    super(props)
    this.state = { openPodcast: null }
  }

  static async getInitialProps({ query, res }) {
    let id = query.id;

    try {
      let [reqChannel, reqSeries, reqAudios] = await Promise.all([
        fetch(`https://api.audioboom.com/channels/${id}`),
        fetch(`https://api.audioboom.com/channels/${id}/child_channels`),
        fetch(`https://api.audioboom.com/channels/${id}/audio_clips`)
      ]);

      if (reqChannel.status >= 404) {
        res.statusCode = reqChannel.status;
        return {
          channel: null,
          audioClips: null,
          series: null,
          statusCode: reqChannel.status
        };
      }

      let dataChannel = await reqChannel.json();
      let channel = dataChannel.body.channel;

      let dataAudios = await reqAudios.json();
      let audioClips = dataAudios.body.audio_clips;

      let dataSeries = await reqSeries.json();
      let series = dataSeries.body.channels;

      return { channel, audioClips, series, statusCode: 200 };
    } catch (e) {
      return { channel: null, audioClips: null, series: null, statusCode: 503 };
    }
  }

  openPodcast = (event, podcast) => {
    event.preventDefault()
  }

  render() {
    const { channel, audioClips, series, statusCode } = this.props;

    if (statusCode !== 200) {
      return <Error statusCode={statusCode} />;
    }

    return (
      <Layout title={channel.title}>
        <div
          className="banner"
          style={{
            backgroundImage: `url(${channel.urls.banner_image.original})`
          }}
        ></div>

        <h1>{channel.title}</h1>
        {series.length > 0 && (
          <div>
            <h2>Series</h2>
            <ChannelGrid channels={series} />
          </div>
        )}

        <h2>Últimos Podcasts</h2>
        <PodcastList audio_clips={audioClips} />

        <style jsx>{`
          header {
            color: #fff;
            background: #8756ca;
            padding: 15px;
            text-align: center;
          }
          .banner {
            width: 100%;
            padding-bottom: 25%;
            background-position: 50% 50%;
            background-size: cover;
            background-color: #aaa;
          }
          .channels {
            display: grid;
            grid-gap: 15px;
            padding: 15px;
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          }
          a.channel {
            display: block;
            margin-bottom: 0.5em;
            color: #333;
            text-decoration: none;
          }
          .channel {
            display: block;
            border-radius: 3px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
            margin-bottom: 0.5em;
          }
          .channel img {
            border-radius: 3px;
            box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);
            width: 100%;
          }
          h1 {
            font-weight: 600;
            padding: 15px;
          }
          h2 {
            padding: 5px;
            font-size: 1.7em;
            font-weight: 600;
            margin: 0;
            text-align: center;
          }
          h5 {
            text-align: center;
          }
        `}</style>
      </Layout>
    );
  }
}

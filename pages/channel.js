import Link from 'next/link'
import Error from './_error'
import Layout from '../components/Layout'

export default class extends React.Component {

  static async getInitialProps({ query, res }) {
    let id = query.id

    try {

      let [reqChannel, reqSeries, reqAudios] = await Promise.all([
        fetch(`https://api.audioboom.com/channels/${id}`),
        fetch(`https://api.audioboom.com/channels/${id}/child_channels`),
        fetch(`https://api.audioboom.com/channels/${id}/audio_clips`)
      ])

      if (reqChannel.status >= 404) {
        res.statusCode = reqChannel.status
        return { channel: null, audioClips: null, series: null, statusCode: reqChannel.status }
      }

      let dataChannel = await reqChannel.json()
      let channel = dataChannel.body.channel

      let dataAudios = await reqAudios.json()
      let audioClips = dataAudios.body.audio_clips

      let dataSeries = await reqSeries.json()
      let series = dataSeries.body.channels

      return { channel, audioClips, series, statusCode: 200 }

    } catch (e) {
      return { channel: null, audioClips: null, series: null, statusCode: 503 }
    }
  }

  render() {
    const { channel, audioClips, series, statusCode } = this.props

    if (statusCode !== 200) {
      return <Error statusCode={ statusCode } />
    }

    return <Layout title={channel.title}>

      <h1>{channel.title}</h1>

      <h2>Últimos Podcasts</h2>
      {audioClips.map((clip) => (
        <Link href={`/podcast?id=${clip.id}`} key={clip.id}>
          <a className="channel">{clip.title}</a>
        </Link>
      ))}
      
      <h2>Series</h2>
      {series.map((serie) => (
        <div className="channel">{serie.title}</div>
      ))}

      <style jsx>{`
        header {
          color: #fff;
          background: #8756ca;
          padding: 15px;
          text-align:center;
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
        .channel img{
          border-radius: 3px;
          box-shadow: 0px 2px 6px rgba(0,0,0,0.15);
          width: 100%;
        }
        h1 {
          font-weight: 600;
          padding: 15px;
        }
        h2 {
          padding: 5px;
          font-size: 0.9em;
          font-weight: 600;
          margin: 0;
          text-align: center;
        }
      `}</style>
    </Layout>
  }
}
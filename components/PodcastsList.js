"use strict";

import { Link } from "../routes";
import slug from "../helpers/slug";

export default class PodcastList extends React.Component {
  render() {
    const { audio_clips } = this.props;

    return (
      <div className="audioClips">
        {audio_clips.map(clip => (
          <Link
            route="podcast"
            params={{
              slug: slug(clip.title),
              id: clip.id,
              slugChannel: slug(clip.channel.title),
              idChannel: clip.channel.id
            }}
            key={clip.id}
          >
            <a className="audioClip">
              <h2>{clip.title}</h2>
              <img src={clip.urls.post_image.original} alt={clip.title} />
              <div className="meta">
                {Math.ceil(clip.duration / 60)} minutes
              </div>
            </a>
          </Link>
        ))}

        <style jsx>
          {`
            .audioClips {
              display: grid;
              grid-gap: 15px;
              padding: 15px;
              grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            }

            a.audioClip {
              display: block;
              margin-bottom: 0.5em;
              color: #333;
              text-decoration: none;
            }

            .meta {
              color: #666;
              margin-top: 0.5em;
              font-size: 0.8em;
            }

            .audioClip img {
              border-radius: 3px;
              box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);
              width: 100%;
            }

            h2 {
              padding: 5px;
              font-size: 0.9em;
              font-weight: 600;
              margin: 0;
              text-align: center;
            }
          `}
        </style>
      </div>
    );
  }
}

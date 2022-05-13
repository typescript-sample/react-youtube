import * as React from 'react';
import { Link } from 'react-router-dom';
import { ListResult, Playlist, PlaylistVideo } from 'video-service';
import { Slide } from './Slide';

export interface Props {
  channelId: string;
  getChannelPlaylists: (channelId: string, max?: number, nextPageToken?: string, fields?: string[]) => Promise<ListResult<Playlist>>;
  getPlaylistVideos: (playlistId: string, max?: number, nextPageToken?: string, fields?: string[]) => Promise<ListResult<PlaylistVideo>>;
  prefix: string;
}
export const HorizontalPlaylists = (props: Props) => {
  const scrollRef = React.useRef<any>();
  const liRef = React.useRef<any>();
  const [playlists, setPlaylists] = React.useState<Playlist[]>([]);

  const scroll = (dir: string) => {
    const { current } = scrollRef;
    if (!current) {
      return;
    }
    const childWidth = current.childNodes.length;
    const scrollWidth = (current.scrollWidth / childWidth) * 4;
    if (dir === 'left') {
      current.scrollLeft -= scrollWidth;
    } else {
      current.scrollLeft += scrollWidth;
    }
  };

  React.useEffect(() => {
    (() => {
      if (props.channelId) {
        props.getChannelPlaylists(props.channelId).then(res => {
          setPlaylists(res.list);
        });
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='scroll-view'>
      <ul className='list-view horizon' ref={scrollRef}>
        {playlists && playlists.map((item) => (
          <li key={item.id} className='video' ref={liRef}>
            <div className='cover'>
              <Slide id={item.id} thumbnail={item.mediumThumbnail} thumbnailSize='mediumThumbnail' getVideos={props.getPlaylistVideos} />
            </div>
            <h4><Link to={`${props.prefix}${item.channelId}`}>{item.title}</Link></h4>
          </li>
        )
        )}
      </ul>
      <button type='button' onClick={() => scroll('left')} className='left-arrow' style={{transform: 'rotate(180deg)'}}>
        &#10095;
      </button>
      <button type='button' onClick={() => scroll('right')} className='right-arrow'>
        &#10095;
      </button>
    </div>
  );
};

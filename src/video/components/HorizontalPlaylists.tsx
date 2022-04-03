import * as React from 'react';
import { Link } from 'react-router-dom';
import { ListResult, Playlist, PlaylistVideo } from 'video-service';
import Slide from './Slide';

export interface Props {
  channelId: string;
  getChannelPlaylists: (channelId: string, max?: number, nextPageToken?: string, fields?: string[]) => Promise<ListResult<Playlist>>;
  getPlaylistVideos: (playlistId: string, max?: number, nextPageToken?: string, fields?: string[]) => Promise<ListResult<PlaylistVideo>>;
}
const HorizontalPlaylists = (props: Props) => {
  const [playlists, setPlaylists] = React.useState<Playlist[]>([]);

  React.useEffect(() => {
    (async () => {
      if (props.channelId) {
        const res = await props.getChannelPlaylists(props.channelId);
        setPlaylists(res.list);
      }
    })();
  }, []);
  return (
    <ul className='list-view horizon'>
      {playlists && playlists.map((item) => (
        <li key={item.id} className='video'>
          <div className='cover'>
            <Slide id={item.id} thumbnail={item.mediumThumbnail} thumbnailSize='mediumThumbnail' getVideos={props.getPlaylistVideos} />
          </div>
          <h4><Link to={`/channels/${item.channelId}`}>{item.title}</Link></h4>
        </li>
      )
      )}
    </ul>
  );
};
export default HorizontalPlaylists;

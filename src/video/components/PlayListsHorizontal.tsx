import * as React from 'react';
import { Link } from 'react-router-dom';
import { ListResult, Playlist, PlaylistVideo } from 'video-service';
import SlideShow from './SlideShow';

export interface Props {
  channelId: string;
  getChannelPlaylists: (channelId: string, max?: number, nextPageToken?: string, fields?: string[]) => Promise<ListResult<Playlist>>;
  getPlaylistVideos: (playlistId: string, max?: number, nextPageToken?: string, fields?: string[]) => Promise<ListResult<PlaylistVideo>>;
}
const PlayListsHorizontal = (props: Props) => {
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
            <SlideShow id={item.id} thumbnail={item.mediumThumbnail} thumbnailSize='mediumThumbnail' getVideos={props.getPlaylistVideos} />
          </div>
          <h4><Link to={`/channels/${item.channelId}`}>{item.title}</Link></h4>
        </li>
      )
      )}
    </ul>
  );
};
export default PlayListsHorizontal;

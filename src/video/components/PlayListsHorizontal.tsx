import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ListResult, Playlist, PlaylistVideo } from '../video-service';
import SlideShow from './SlideShow';

export interface Props {
  channelId: string;
  getChannelPlaylists: (channelId: string, max?: number, nextPageToken?: string, fields?: string[]) => Promise<ListResult<Playlist>>;
  getPlaylistVideos: (playlistId: string, max?: number, nextPageToken?: string, fields?: string[]) => Promise<ListResult<PlaylistVideo>>;
}
const PlayListsHorizontal = (props: Props) => {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = React.useState<Playlist[]>([]);

  React.useEffect(() => {
    (async () => {
      if (props.channelId) {
        const res = await props.getChannelPlaylists(props.channelId);
        setPlaylists(res.list);
      }
    })();
  }, []);

  const view = (e: any, id?: string) => {
    e.preventDefault();
    if (id && id.length > 0) {
      navigate(`/channels/${id}`);
    }
  };
  return (
    <ul className='list-view horizon'>
      {playlists && playlists.map((item) => (
        <li key={item.id} className='video'>
          <div className='cover'>
            <SlideShow id={item.id} thumbnail={item.mediumThumbnail} thumbnailSize='mediumThumbnail' getVideos={props.getPlaylistVideos} />
          </div>
          <h4 onClick={e => view(e, item.channelId)}>{item.title}</h4>
        </li>
      )
      )}
    </ul>
  );
};
export default PlayListsHorizontal;

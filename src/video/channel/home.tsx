import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Slide } from 'react-videos';
import { useResource } from 'uione';
import { Playlist, PlaylistVideo } from '../../clients';
import { context } from '../service';

const videoFields = ['id', 'title', 'publishedAt', 'highThumbnail', 'definition', 'duration'];
const playlistFields = ['id', 'title', 'publishedAt', 'mediumThumbnail', 'count'];

const Home = () => {
  const { id } = useParams();
  const resource = useResource();
  const videoService = context.getVideoService();
  const [videos, setVideos] = React.useState<PlaylistVideo[]>([]);
  const [playlists, setPlaylists] = React.useState<Playlist[]>([]);

  React.useEffect(() => {
    (() => {
      if (id) {
        videoService.getChannelVideos(id, 12, undefined, videoFields).then(res => setVideos(res.list));
        videoService.getChannelPlaylists(id, 12, undefined, playlistFields).then(res => setPlaylists(res.list));
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const formatToMinutes = (s: number) => {
    return (s - (s %= 60)) / 60 + ':' + s;
  };
  return (
    <div className='content'>
      <ul className='list horizon'>
        {videos && videos.map((item, i) => {
          return (
            <li key={i} className='video'>
              <div className='cover' style={{ backgroundImage: `url('${item.highThumbnail}')` }}>
                {item.definition && item.definition > 4 && <i>HD</i>}
              </div>
              {item.duration && item.duration > 0 ? <p>{formatToMinutes(item.duration)}</p> : <p>{resource.short_video}</p>}
              <Link to={`/${item.id}`}>{item.title}</Link>
              <p className='date'>{item.publishedAt.toDateString()}</p>
            </li>
          );
        })}
      </ul>
      <ul className='list horizon'>
        {playlists && playlists.map((item, i) => {
          return (
            <li key={i} className='video'>
              <div className='cover'>
                <i style={{ zIndex: 11 }}>{item.count}</i>
                <Slide id={item.id} thumbnail={item.mediumThumbnail} thumbnailSize='mediumThumbnail' getVideos={videoService.getPlaylistVideos} />
              </div>
              <Link to={`/playlists/${item.id}`}>{item.title}</Link>
              <p className='date'>{item.publishedAt.toDateString()}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default Home;

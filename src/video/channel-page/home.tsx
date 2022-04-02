import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import SlideShow from '../components/SlideShow';
import { context } from '../service';
import { Playlist, PlaylistVideo } from 'video-service';

const videoFields = ['id', 'title', 'publishedAt', 'highThumbnail', 'definition', 'duration'];
const playlistFields = ['id', 'title', 'publishedAt', 'mediumThumbnail', 'count'];

const Home = () => {
  const { id } = useParams();
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
  }, []);
  const formatToMinutes = (s: number) => {
    return (s - (s %= 60)) / 60 + ':' + s;
  };
  return (
    <div>
      <ul className='list-view horizon'>
        {videos && videos.map((item, i) => {
          return (
            <li key={i} className='video'>
              <div className='cover' style={{ backgroundImage: `url('${item.highThumbnail}')` }}>
                {item.definition && item.definition > 4 && <i>HD</i>}
              </div>
              {item.duration && item.duration > 0 ? <p>{formatToMinutes(item.duration)}</p> : <p>Short Video</p>}
              <Link to={`/${item.id}`}>{item.title}</Link>
              <p className='date'>{item.publishedAt.toDateString()}</p>
            </li>
          );
        })}
      </ul>
      <ul className='list-view horizon'>
        {playlists && playlists.map((item, i) => {
          return (
            <li key={i} className='video'>
              <div className='cover'>
                <i style={{ zIndex: 11 }}>{item.count}</i>
                <SlideShow id={item.id} thumbnail={item.mediumThumbnail} thumbnailSize='mediumThumbnail' getVideos={videoService.getPlaylistVideos} />
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

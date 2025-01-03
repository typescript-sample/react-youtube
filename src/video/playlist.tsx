import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Comments } from 'reactx-comments';
import { storage } from 'uione';
import { buildShownItems, Playlist, PlaylistVideo } from '../clients';
import { context } from './service';

const max = 12;
const videoFields = ['id', 'title', 'publishedAt', 'highThumbnail', 'description', 'videoOwnerChannelId', 'videoOwnerChannelTitle', 'definition', 'duration'];

export default function PlaylistPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource] = useState(storage.resource().resource());
  const resourceService = storage.resource();
  const videoService = context.getVideoService();
  const [keyword, setKeyword] = useState('');
  const [videos, setVideos] = useState<PlaylistVideo[]>([]);
  const [video, setVideo] = useState<PlaylistVideo>();
  const [allVideos, setAllVideos] = useState<PlaylistVideo[]>([]);
  const [nextPageToken, setNextPageToken] = useState('');
  const [playlist, setPlaylist] = useState<Playlist>();

  useEffect(() => {
    if (document) {
      const ele = document.scrollingElement;
      if (ele != null) {
        window.addEventListener('scroll', () => console.log(ele.scrollHeight));
      }
    }
    if (id) {
      videoService.getPlaylist(id).then(pl => {
        if (pl) {
          setPlaylist(pl);
        }
      });
      videoService.getPlaylistVideos(id, 12, undefined, videoFields).then(res => {
        setVideos(res.list);
        setAllVideos(res.list);
        setNextPageToken(res.nextPageToken ?? '');
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const back = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (e) {
      e.preventDefault();
    }
    navigate(-1);
  };

  const keywordOnChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const word = e.target.value;
    const vs = buildShownItems(word, allVideos);
    setKeyword(word);
    setVideos(vs);
  };
  const view = (e: React.MouseEvent<HTMLHeadingElement, MouseEvent>, v: PlaylistVideo) => {
    setVideo(v);
  };

  const loadMore = async () => {
    if (id && nextPageToken !== undefined) {
      const res = await videoService.getPlaylistVideos(id, max, nextPageToken, videoFields);
      setVideos(videos.concat(res.list));
      setNextPageToken(res.nextPageToken || '');
    }
  };
  const formatToMinutes = (s: number) => {
    return (s - (s %= 60)) / 60 + ':' + s;
  };

  const show: boolean = (video != null && video !== undefined);
  return (
    <div className='view-container'>
      <header>
        <button type='button' id='btnBack' name='btnBack' className='btn-back' onClick={back}/>
        <h2>{playlist && playlist.title}</h2>
      </header>
      <div className={show ? 'list-detail-container' : ''}>
        <div className={show ? 'list-content' : ''}>
          <form id='playlistForm' name='playlistForm'>
            <section className='row search-group'>
              <label className='col s12 search-input'>
                <i className='btn-search' />
                <input type='text'
                  id='keyword'
                  name='keyword'
                  onChange={keywordOnChanged}
                  value={keyword}
                  maxLength={40}
                  placeholder={resource.role_assignment_search_user} />
              </label>
            </section>
          </form>
          <form className='list-result'>
            <ul className='row list'>
              {videos && videos.map((item, i) => {
                return (
                  <li key={i} className='col s12 m6 l4 xl3 video'>
                    <section>
                      <div className='cover' style={{ backgroundImage: `url('${item.highThumbnail}')` }}>
                        {item.definition && item.definition > 4 && <i>HD</i>}
                      </div>
                      {item.duration && item.duration > 0 ? <p>{formatToMinutes(item.duration)}</p> : <p>Short Video</p>}
                      <h4 onClick={e => view(e, item)}>{item.title}</h4>
                      <p>{item.channelTitle}<i className='date'>{item.publishedAt.toDateString()}</i></p>
                    </section>
                  </li>
                );
              })}
            </ul>
            {nextPageToken && <button type='button' id='btnMore' name='btnMore' className='btn-more' onClick={loadMore}>{resource.button_more}</button>}
          </form>
        </div>
        {video && <div className='detail-content'>
          <form id='videoForm' name='videoForm' style={{ minHeight: '100vh' }}>
            <div className='video-container'>
              <div>
                {/* <img src={video.standardThumbnail}/> */}
                <iframe
                  width='100%'
                  height='600'
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title='Video Player'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen={true} />
              </div>
              <h3>{video.title}</h3>
              <h4>{video.channelTitle}<i className='date'>{video.publishedAt.toDateString()}</i></h4>
              <p>{video.description}</p>
            </div>
          </form>
          <Comments videoId={video.id} getCommentThreads={videoService.getCommentThreads} getComments={videoService.getComments} order='relevance' resource={resource} format={resourceService.format}/>
        </div>}
      </div>
    </div>
  );
}

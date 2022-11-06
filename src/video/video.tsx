import * as React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { VideoInfoBox } from 'react-videos';
import { Comments } from 'reactx-comments';
import { getResource, useResource } from 'uione';
import { Item, Video } from 'video-clients';
import { context } from './service';

const perPage = [12, 12, 12, 12];
const max = perPage.reduce((a, b) => a + b, 0);
const videoFields = ['id', 'title', 'publishedAt', 'mediumThumbnail', 'channelId', 'channelTitle', 'categoryId'];

const VideoPage = () => {
  const param = useParams();
  const resource = useResource();
  const resourceService = getResource();
  const navigate = useNavigate();
  const { id } = useParams();
  const videoService = context.getVideoService();
  const [listRelated, setListRelated] = React.useState<Item[]>([]);
  const [video, setVideo] = React.useState<Video>();
  const [page, setPage] = React.useState(1);
  const [channelThumbnail, setchannelThumbnail] = React.useState<string>();
  const [sliceData, setSliceData] = React.useState<Item[]>([]);

  React.useEffect(() => {
    (() => {
      if (id) {
        videoService.getVideo(id).then(res => {
          if (res) {
            setVideo(res);
            if (videoService.getRelatedVideos) {
              videoService.getRelatedVideos(id, max, undefined, videoFields).then(resRelatedVideo => {
                setListRelated(resRelatedVideo.list);
                setSliceData(resRelatedVideo.list.slice(0, perPage[0]));
                setPage(page + 1);
              });
            }
            if (res.channelId && res.channelId.length > 0) {
              videoService.getChannel(res.channelId).then(channel => {
                if (channel) {
                  setchannelThumbnail(channel.thumbnail ? channel.thumbnail : channel.mediumThumbnail);
                }
              });
            }
          }
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param]);

  const back = () => {
    navigate(-1);
  };

  const loadMore = () => {
    const begin = (page - 1) * perPage[page - 1];
    const end = page * perPage[page - 1];
    setSliceData([...sliceData, ...listRelated.slice(begin, end)]);
    setPage(page + 1);
  };
  const css = videoService.getRelatedVideos && sliceData && sliceData.length > 0 ? 'col s12 m12 l9 xl9 video-content' : 'col s12 m12 l12 xl12 video-content';
  return (
    <div className='view-container'>
      <header>
        <button type='button' id='btnBack' name='btnBack' className='btn-back' onClick={back} />
        <h2>{video && video.title}</h2>
      </header>
      <div className='row list-view'>
        <div className={css}>
          <form id='videoForm' name='videoForm' style={{ paddingTop: 8 }}>
            <div className='video-container'>
              <div>
                <iframe
                  width='100%'
                  height='600'
                  src={`https://www.youtube.com/embed/${id}`}
                  title='Video Player'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen={true}
                />
              </div>
              {
                video && <VideoInfoBox video={video} channelThumbnail={channelThumbnail} prefix='/channels/' resource={resource}/>
              }
            </div>
          </form>
          <Comments videoId={id} getCommentThreads={videoService.getCommentThreads} getComments={videoService.getComments} order='relevance' resource={resource} format={resourceService.format}/>
        </div>
        {videoService.getRelatedVideos && sliceData && sliceData.length > 0 && <div className='col s12 m12 l3 xl3 video-content'>
          <form className='list-result'>
            <ul className='list-view'>
              {sliceData.map((item, i) => {
                return (
                  <li key={i} className='card'>
                    <section>
                      <div className='cover' style={{ backgroundImage: `url('${item.highThumbnail ? item.highThumbnail : ''}')` }} />
                      <Link to={`/${item.id}`}>{item.title}</Link>
                    </section>
                  </li>
                );
              })}
            </ul>
            {page - 1 !== perPage.length && <button type='button' id='btnMore' name='btnMore' className='btn-more' onClick={loadMore}>{resource.button_more}</button>}
          </form>
        </div>}
      </div>
    </div>
  );
};
export default VideoPage;

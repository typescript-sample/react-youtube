import { locale } from 'locale-service';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { getBrowserLanguage, useResource } from 'uione';
import { ListResult, Video, VideoCategory } from 'video-service';
import CategoryTab from './components/CategoryTab';
import { context } from './service';

const max = 48;
const videoFields = ['id', 'title', 'publishedAt', 'highThumbnail', 'channelId', 'channelTitle', 'categoryId', 'duration', 'definition'];

function getRegion(): string {
  const language = getBrowserLanguage();
  const l = locale(language);
  const region = (l ? l.countryCode : 'US');
  return region;
}
const HomePage = () => {
  const resource = useResource();
  const videoService = context.getVideoService();
  const [videos, setVideos] = React.useState<Video[]>([]);
  const [nextPageToken, setNextPageToken] = React.useState<string>();
  const [videoCategories, setVideoCategories] = React.useState<VideoCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<string>();

  React.useEffect(() => {
    (async () => {
      const region = getRegion();
      const res = await videoService.getCagetories(region);
      setVideoCategories(res);
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      const region = getRegion();
      let res: ListResult<Video>;
      if (selectedCategory) {
        res = await videoService.getPopularVideosByCategory(selectedCategory, max, undefined, videoFields);
      } else {
        res = await videoService.getPopularVideosByRegion(region, max, undefined, videoFields);
      }
      setNextPageToken(res.nextPageToken);
      setVideos(res.list);
    })();
  }, [selectedCategory]);

  const handleLoadMore = async () => {
    const region = getRegion();
    let res: ListResult<Video>;
    if (selectedCategory) {
      res = await videoService.getPopularVideosByCategory(selectedCategory, max, nextPageToken, videoFields);
    } else {
      res = await videoService.getPopularVideosByRegion(region, max, nextPageToken, videoFields);
    }
    setNextPageToken(res.nextPageToken);
    const newList = [...videos].concat(res.list);
    setVideos(newList);
  };
  const formatToMinutes = (s: number) => {
    return (s - (s %= 60)) / 60 + ':' + s;
  };
  return (
    <div>
      <CategoryTab
        data={videoCategories}
        setSelectedTab={setSelectedCategory}
      />
      <ul className='row list-view'>
        {videos && videos.map((item, i) => {
          return (
            <li key={i} className='col s12 m6 l4 xl3 video'>
              <section>
                <div className='cover' style={{ backgroundImage: `url('${item.highThumbnail}')` }}>
                  {item.definition && item.definition > 4 && <i>HD</i>}
                </div>
                {item.duration > 0 ? <p>{formatToMinutes(item.duration)}</p> : <p>Short Video</p>}
                <Link to={`/${item.id}`}>{item.title}</Link>
                <p><Link to={`/channels/${item.channelId}`}>{item.channelTitle}</Link><i className='date'>{item.publishedAt.toDateString()}</i></p>
              </section>
            </li>
          );
        })}
      </ul>
      {nextPageToken && <button type='submit' id='btnMore' name='btnMore' className='btn-more' onClick={handleLoadMore}>{resource.button_more}</button>}
    </div>
  );
};
export default HomePage;

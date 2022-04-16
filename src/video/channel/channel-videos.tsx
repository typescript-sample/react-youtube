import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useResource } from 'uione';
import { buildShownItems, ListResult, PlaylistVideo } from 'video-service';

const max = 12;
const videoFields = ['id', 'title', 'publishedAt', 'highThumbnail', 'definition', 'duration'];

export interface Props {
  getChannelVideos: (channelId: string, max?: number, nextPageToken?: string, fields?: string[]) => Promise<ListResult<PlaylistVideo>>;
}
const ChannelVideos = (props: Props) => {
  const { id } = useParams();
  const resource = useResource();
  const [keyword, setKeyword] = React.useState<string>('');
  const [videos, setVideos] = React.useState<PlaylistVideo[]>([]);
  const [allVideos, setAllVideos] = React.useState<PlaylistVideo[]>([]);
  const [nextPageToken, setNextPageToken] = React.useState<string>();

  React.useEffect(() => {
    (async () => {
      if (id) {
        const res = await props.getChannelVideos(id, 24, undefined, videoFields);
        const items = buildShownItems(keyword, res.list);
        setAllVideos(res.list);
        setVideos(items);
        setNextPageToken(res.nextPageToken);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoadMore = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault();
    }
    if (id) {
      const res = await props.getChannelVideos(id, max, nextPageToken, videoFields);
      const newList = [...allVideos].concat(res.list);
      const items = buildShownItems(keyword, newList);
      setAllVideos(newList);
      setVideos(items);
      setNextPageToken(res.nextPageToken);
    }
  };
  const keywordOnChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const word = e.target.value;
    const items = buildShownItems(keyword, allVideos);
    setVideos(items);
    setKeyword(word);
  };
  const formatToMinutes = (s: number) => {
    return (s - (s %= 60)) / 60 + ':' + s;
  };
  return (
    <div>
      <form id='channelVideosForm' name='channelVideosForm'>
        <section className='row search-group'>
          <label className='col s12 search-input'>
            <i className='btn-search' />
            <input type='text'
              id='keyword'
              name='keyword'
              onChange={keywordOnChanged}
              value={keyword}
              maxLength={40}
              placeholder={resource.filter_videos} />
          </label>
        </section>
      </form>
      <form className='list-result'>
        <ul className='row list-view'>
          {videos && videos.map((item, i) => {
            return (
              <li key={i} className='col s12 m6 l4 xl3 video'>
                <section>
                  <div className='cover' style={{ backgroundImage: `url('${item.highThumbnail}')` }}>
                    {item.definition && item.definition > 4 && <i>HD</i>}
                  </div>
                  {item.duration && item.duration > 0 ? <p>{formatToMinutes(item.duration)}</p> : <p>Short Video</p>}
                  <Link to={`/${item.id}`}>{item.title}</Link>
                  <p className='date'>{item.publishedAt.toDateString()}</p>
                </section>
              </li>
            );
          })}
        </ul>
        {keyword.length === 0 && nextPageToken && <button type='submit' id='btnMore' name='btnMore' className='btn-more' onClick={handleLoadMore}>{resource.button_more}</button>}
      </form>
    </div>
  );
};
export default ChannelVideos;

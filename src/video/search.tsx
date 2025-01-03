import * as React from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { FilterBar } from 'react-videos';
import { useResource } from 'uione';
import { Duration, Item, ItemFilter, ItemType, SortType } from '../clients';
import { context } from './service';

const max = 50;
const itemFields = ['id', 'title', 'publishedAt', 'highThumbnail', 'channelId', 'channelTitle', 'categoryId', 'publishTime', 'kind', 'duration', 'definition'];
const playlistFields = ['id', 'title', 'publishedAt', 'highThumbnail', 'channelId', 'channelTitle', 'categoryId', 'publishTime', 'kind'];
const channelFields = ['id', 'title', 'publishedAt', 'highThumbnail', 'title'];

export interface Filter {
  type: ItemType;
  duration: Duration;
  order?: SortType;
  nextPageToken?: string;
  q?: string;
}
const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const resource = useResource();
  const { key } = useParams();
  const videoService = context.getVideoService();
  const [videos, setVideos] = React.useState<Item[]>([]);
  const [keyword, setKeyword] = React.useState<string>(key ? key : '');
  const [filter, setFilter] = React.useState<Filter>({
    type: 'any',
    duration: 'any',
    order: 'relevance',
    nextPageToken: '',
  });

  React.useEffect(() => {
    // const { type , duration, order, nextPageToken, q } = Object.fromEntries([...searchParams])
    setFilter({
      type: searchParams.get('type') as ItemType || 'any',
      duration: searchParams.get('duration') as Duration || 'any',
      order: searchParams.get('order') as SortType || 'relevance',
      nextPageToken: searchParams.get('nextPageToken') as string
    });
    setKeyword(searchParams.get('q') as string || '');
  }, [searchParams]);
  const getData = () => {
    (async () => {
      const sm: ItemFilter = {
        q: searchParams.get('q') as string || '',
        type: searchParams.get('type') as ItemType || 'any',
        duration: searchParams.get('duration') as Duration || 'any',
        sort: searchParams.get('order') as SortType || 'relevance'
      };
      let res: any;
      switch (sm.type) {
        case 'video':
          res = await videoService.searchVideos(sm, max, undefined, itemFields);
          break;
        case 'playlist':
          res = await videoService.searchPlaylists(sm, max, undefined, itemFields);
          break;
        case 'channel':
          res = await videoService.searchChannels(sm, max, undefined, itemFields);
          break;
        default:
          res = await videoService.searchVideos(sm, max, undefined, itemFields);
          break;
      }
      setFilter((prev) => ({ ...prev, nextPageToken: res.nextPageToken }));
      setVideos(res.list);
    })();
  };

  React.useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterType = async (value: ItemType) => {
    const type = value;
    const sm: ItemFilter = { q: keyword, type, sort: filter.order };
    let res: any;
    switch (type) {
      case 'video':
        res = await videoService.searchVideos(sm, max, undefined, itemFields);
        break;
      case 'playlist':
        res = await videoService.searchPlaylists(sm, max, undefined, playlistFields);
        break;
      case 'channel':
        res = await videoService.searchChannels(sm, max, undefined, channelFields);
        break;
      default:
        res = await videoService.searchVideos(sm, max, undefined, itemFields);
        break;
    }
    setSearchParams({ ...Object.fromEntries([...searchParams]), type, duration: 'any', nextPageToken: res.nextPageToken || '' });
    setFilter((pre) => ({ ...pre, type, duration: 'any', nextPageToken: res.nextPageToken || '' }));
    setVideos(res.list);
  };

  const handleFilterDuration = async (value: Duration) => {
    const videoDuration = value as Duration;
    const sm: ItemFilter = { q: keyword, type: filter.type, duration: videoDuration, sort: filter.order };
    const res = await videoService.searchVideos(sm, max, filter.nextPageToken, itemFields);
    setSearchParams({ ...Object.fromEntries([...searchParams]), duration: videoDuration, nextPageToken: res.nextPageToken as string || '' });
    setFilter((pre) => ({ ...pre, duration: videoDuration, nextPageToken: res.nextPageToken || '' }));
    setVideos(res.list);
  };

  const handleFilterOrder = async (order: SortType) => {
    const sm: ItemFilter = { q: keyword, type: filter.type, duration: filter.duration, sort: order };
    let res: any;
    switch (sm.type) {
      case 'video':
        res = await videoService.searchVideos(sm, max, undefined, itemFields);
        break;
      case 'playlist':
        res = await videoService.searchPlaylists(sm, max, undefined, itemFields);
        break;
      case 'channel':
        res = await videoService.searchChannels(sm, max, undefined, itemFields);
        break;
      default:
        res = await videoService.searchVideos(sm, max, undefined, itemFields);
        break;
    }
    setSearchParams({ ...Object.fromEntries([...searchParams]), order: sm.sort as string, nextPageToken: res.nextPageToken || '' });
    setFilter((pre) => ({ ...pre, order: sm.sort, nextPageToken: res.nextPageToken || '' }));
    setVideos(res.list);
  };

  const handleLoadMore = async () => {
    const sm: ItemFilter = {
      q: keyword, type: filter.type, duration: filter.duration, sort: filter.order
    };
    let res: any;
    switch (sm.type) {
      case 'video':
        res = await videoService.searchVideos(sm, max, filter.nextPageToken, itemFields);
        break;
      case 'playlist':
        res = await videoService.searchPlaylists(sm, max, filter.nextPageToken, itemFields);
        break;
      case 'channel':
        res = await videoService.searchChannels(sm, max, filter.nextPageToken, itemFields);
        break;
      default:
        res = await videoService.searchVideos(sm, max, filter.nextPageToken, itemFields);
        break;
    }
    const newList = [...videos].concat(res.list);
    setVideos(newList);
    setFilter((pre) => ({ ...pre, nextPageToken: res.nextPageToken }));
  };

  return (
    <div className='full'>
      <div className='tool-bar'>
        <FilterBar searchParams={searchParams} handleFilterType={handleFilterType} handleFilterDuration={handleFilterDuration} handleFilterOrder={handleFilterOrder} filter={filter} resource={resource} />
      </div>
      <ul className='row list'>
        {videos && videos.map((item, i) => {
          return (
            <li key={i} className='col s12 m6 l4 xl3 card'>
              <section>
                <div className='cover' style={{ backgroundImage: `url('${item.highThumbnail}')` }}>
                  {item.definition && item.definition > 4 && <i>HD</i>}
                </div>
                {item.duration && item.duration && <p>{formatTime(item.duration)}</p>}
                <h4 className='title'><Link to={getLink(item)}>{item.title}</Link></h4>
                {item.channelId && item.channelTitle && <p><Link to={`/channels/${item.channelId}`}>{item.channelTitle}</Link>{item.publishedAt.toDateString()}</p>}
              </section>
            </li>
          );
        })}
      </ul>
      {filter.nextPageToken && <button type='submit' id='btnMore' name='btnMore' className='btn-more' onClick={handleLoadMore}>{resource.button_more}</button>}
    </div>
  );
};
export default SearchPage;

function formatTime(s: number): string {
  return (s - (s %= 60)) / 60 + ':' + s;
}
function getLink(value: Item): string {
  switch (value.kind) {
    case 'video':
      return `/${value.id}`;
    case 'playlist':
      return `/playlists/${value.id}`;
    case 'channel':
      return `/channels/${value.id}`;
    default:
      return `/${value.id}`;
  }
}

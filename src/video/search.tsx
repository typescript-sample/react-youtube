import * as React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useResource } from 'uione';
import { Duration, Item, ItemFilter, ItemType, SortType } from 'video-service';
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
}
const SearchPage = () => {
  const resource = useResource();
  const navigate = useNavigate();
  const { key } = useParams();
  const videoService = context.getVideoService();
  const [videos, setVideos] = React.useState<Item[]>([]);
  const [keyword, setKeyword] = React.useState<string>(key ? key : '');
  const [filter, setFilter] = React.useState<Filter>({
    type: 'any',
    duration: 'any',
    order: 'relevance',
    nextPageToken: ''
  });

  React.useEffect(() => {
    (async () => {
      const sm: ItemFilter = { q: keyword };
      const res = await videoService.searchVideos(sm, max, undefined, itemFields);
      setFilter((prev) => ({ ...prev, nextPageToken: res.nextPageToken }));
      setVideos(res.list);
    })();
  }, []);

  const back = () => {
    navigate(-1);
  };

  const handleInput = (e: { target: { value: string } }) => {
    setKeyword(e.target.value);
  };

  const handleSearch = () => {
    navigate(`/search/${keyword}`);
  };

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
    setFilter((pre) => ({ ...pre, type, duration: 'any', nextPageToken: res.nextPageToken }));
    setVideos(res.list);
  };

  const handleFilterDuration = async (value: Duration) => {
    const videoDuration = value;
    const sm: ItemFilter = { q: keyword, type: filter.type, duration: videoDuration, sort: filter.order };
    const res = await videoService.searchVideos(sm, max, filter.nextPageToken, itemFields);
    setFilter((pre) => ({ ...pre, duration: videoDuration, nextPageToken: res.nextPageToken }));
    setVideos(res.list);
  };

  const handleFilterOrder = async (e: { target: { value: string; }; }) => {
    const order = e.target.value as SortType;
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
    setFilter((pre) => ({ ...pre, order: sm.sort, nextPageToken: res.nextPageToken }));
    setVideos(res.list);
  };

  const handleLoadMore = async () => {
    const sm: ItemFilter = {
      q: keyword, type: filter.type, duration: filter.duration, sort: filter.order
    };
    let res: any;
    console.log(filter.nextPageToken);
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
  const formatToMinutes = (s: number) => {
    return (s - (s %= 60)) / 60 + ':' + s;
  };
  return (
    <div className='view-container'>
      <header>
        <button type='button' id='btnBack' name='btnBack' className='btn-back' onClick={back} />
        <h2>{resource.welcome_title}</h2>
      </header>
      <div className=''>
        <form id='playlistForm' name='playlistForm'>
          <section className='row search-group'>
            <label className='col s12 search-input'>
              <i className='btn-search' onClick={handleSearch} />
              <input type='text'
                onChange={handleInput}
                value={keyword}
                maxLength={40}
              />
            </label>
          </section>
        </form>
        <div className='tool-bar'>
          <ul className='row list-view'>
            <li className='col s12 m3 l3 xl3'>
              <select style={{ width: 150 }} value={filter.type} onChange={(e) => handleFilterType(e.target.value as ItemType)}>
                <option value=''>Search Type</option>
                <option value='video'>Video</option>
                <option disabled={filter.duration !== 'any'} value='channel'>Channel</option>
                <option disabled={filter.duration !== 'any'} value='playlist'>Play List</option>
              </select>
              <i onClick={() => handleFilterType('any')}>X</i>
            </li>
            <li className='col s12 m3 l3 xl3'>
              <select disabled={(filter.type === 'channel' || filter.type === 'playlist')} value={filter.duration} onChange={(e) => handleFilterDuration(e.target.value as Duration)}>
                <option value=''>Duration</option>
                <option value='short'>Below 4 Minutes</option>
                <option value='medium'>4-20 Minutes</option>
                <option value='long'>Over 20 Minutes</option>
              </select>
              <i onClick={() => handleFilterDuration('any')}>X</i>
            </li>
            <li className='col s12 m3 l3 xl3'>
              <select value={filter.order} onChange={handleFilterOrder}>
                <option value=''>Order</option>
                <option value='relevance'>Relevance</option>
                <option value='date'>Date</option>
                <option value='rating'>Rank</option>
              </select>
            </li>
          </ul>
        </div>
        <ul className='row list-view'>
          {videos && videos.map((item, i) => {
            return (
              <li
                key={i}
                className='col s12 m6 l4 xl3 card'
              // onClick={e => this.view(e, item)}
              >
                <section>
                  <div className='cover' style={{ backgroundImage: `url('${item.highThumbnail}')` }}>
                    {item.definition && item.definition > 4 && <i>HD</i>}
                  </div>
                  {item.duration && item.duration && <p>{formatToMinutes(item.duration)}</p>}
                  <h4>{item.title}</h4>
                  <p><Link to={`/channels/${item.channelId}`}>{item.channelTitle}</Link>{item.publishedAt.toDateString()}</p>
                </section>
              </li>
            );
          })}
        </ul>
        {filter.nextPageToken && <button type='submit' id='btnMore' name='btnMore' className='btn-more' onClick={handleLoadMore}>{resource.button_more}</button>}
      </div>
    </div>
  );
};
export default SearchPage;

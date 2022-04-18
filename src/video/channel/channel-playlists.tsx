import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useResource } from 'uione';
import { buildShownItems, ListResult, Playlist } from 'video-service';

const max = 12;
const playlistFields = ['id', 'title', 'publishedAt', 'mediumThumbnail', 'count', 'highThumbnail'];

export interface Props {
  getPlaylists: (channelId: string, max?: number, nextPageToken?: string, fields?: string[]) => Promise<ListResult<Playlist>>;
}
const ChannelPlaylists = (props: Props) => {
  const { id } = useParams();
  const resource = useResource();
  const [keyword, setKeyword] = React.useState<string>('');
  const [playlists, setPlaylists] = React.useState<Playlist[]>([]);
  const [allPlaylists, setAllPlaylists] = React.useState<Playlist[]>([]);
  const [nextPageToken, setNextPageToken] = React.useState<string>();

  React.useEffect(() => {
    (async () => {
      if (id) {
        const res = await props.getPlaylists(id, 24, undefined, playlistFields);
        const items = buildShownItems(keyword, res.list);
        setAllPlaylists(res.list);
        setPlaylists(items);
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
      const res = await props.getPlaylists(id, max, nextPageToken, playlistFields);
      const newList = [...allPlaylists].concat(res.list);
      const items = buildShownItems(keyword, newList);
      setAllPlaylists(newList);
      setPlaylists(items);
      setNextPageToken(res.nextPageToken);
    }
  };
  const keywordOnChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const word = e.target.value;
    const items = buildShownItems(keyword, allPlaylists);
    setPlaylists(items);
    setKeyword(word);
  };
  return (
    <div>
      <form id='channelPlaylistsForm' name='channelPlaylistsForm'>
        <section className='row search-group'>
          <label className='col s12 search-input'>
            <i className='btn-search' />
            <input type='text'
              id='keyword'
              name='keyword'
              onChange={keywordOnChanged}
              value={keyword}
              maxLength={40}
              placeholder={resource.filter_playlists} />
          </label>
        </section>
      </form>
      <form className='list-result'>
        <ul className='row list-view'>
          {playlists && playlists.map((item, i) => {
            return (
              <li key={i} className='col s12 m6 l4 xl3 video'>
                <section>
                  <div className='cover' style={{ backgroundImage: `url('${item.highThumbnail}')` }}>
                    <i>{item.count}</i>
                  </div>
                  <Link to={`/playlists/${item.id}`}>{item.title}</Link>
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
export default ChannelPlaylists;

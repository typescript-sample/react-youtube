import * as React from 'react';
import { storage, StringMap } from 'uione';
import Comments from './components/Comments';
import { context } from './service';
import { buildShownItems, Comment, CommentOrder, CommentThead, ListResult, Playlist, PlaylistVideo } from './video-service';

const max = 12;
const videoFields = ['id', 'title', 'publishedAt', 'highThumbnail', 'description', 'videoOwnerChannelId', 'videoOwnerChannelTitle', 'definition', 'duration'];

interface PlaylistState {
  id?: string;
  title?: string;
  description?: string;
  keyword: string;
  playlist?: Playlist;
  allVideos: PlaylistVideo[];
  videos: PlaylistVideo[];
  video?: PlaylistVideo;
  nextPageToken?: string;
}
export interface Props {
}
export default class PlaylistPage extends React.Component<Props, PlaylistState> {
  constructor(props: Props) {
    super(props);
    // this.setState = this.setState.bind(this);
    // this.back = this.back.bind(this);
    this.resource = storage.resource().resource();
    const videoService = context.getVideoService();
    this.getPlaylist = videoService.getPlaylist;
    this.getPlaylistVideos = videoService.getPlaylistVideos;
    this.getCommentThreads = videoService.getCommentThreads;
    this.getComments = videoService.getComments;
    this.state = {
      keyword: '',
      videos: [],
      allVideos: [],
      nextPageToken: ''
    };
  }
  protected resource: StringMap = {};
  getPlaylistVideos: (playlistId: string, max?: number, nextPageToken?: string, fields?: string[]) => Promise<ListResult<PlaylistVideo>>;
  getPlaylist: (id: string) => Promise<Playlist | null | undefined>;
  getCommentThreads?(videoId: string, order?: CommentOrder, max?: number, nextPageToken?: string): Promise<ListResult<CommentThead>>;
  getComments?(id: string, max?: number, nextPageToken?: string): Promise<ListResult<Comment>>;
  componentWillMount() {
    if (document) {
      const ele = document.scrollingElement;
      if (ele != null) {
        window.addEventListener('scroll', () => console.log(ele.scrollHeight));
      }
    }
    const id = 'PLOWnSFzV-C9Yi1N1cZ_u2v-ed5tNeBXaK';
    if (id) {
      this.getPlaylist(id).then(playlist => {
        if (playlist) {
          this.setState({ playlist });
        }
      });
      this.getPlaylistVideos(id, 12, undefined, videoFields).then(res => this.setState({ videos: res.list, allVideos: res.list, nextPageToken: res.nextPageToken }));
    }
  }
  /*
  back(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (e) {
      e.preventDefault();
    }
    this.props.navigate(-1);
  }
  */
  keywordOnChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    const { allVideos } = this.state;
    const videos = buildShownItems(keyword, allVideos);
    this.setState({ keyword, videos });
  }
  view = (e: any, video: PlaylistVideo) => {
    this.setState({ video });
  }

  loadMore = async () => {
    const id = 'PLOWnSFzV-C9Yi1N1cZ_u2v-ed5tNeBXaK';
    if (id && this.state.nextPageToken !== undefined) {
      const res = await this.getPlaylistVideos(id, max, this.state.nextPageToken, videoFields);
      this.setState({ videos: this.state.videos.concat(res.list), nextPageToken: res.nextPageToken });
    }
  }
  formatToMinutes = (s: number) => {
    return (s - (s %= 60)) / 60 + ':' + s;
  }
  render() {
    const resource = this.resource;
    const { playlist, keyword, videos, video } = this.state;

    const show: boolean = (video != null && video !== undefined);
    return (
      <div className='view-container'>
        <header>
          <button type='button' id='btnBack' name='btnBack' className='btn-back' />
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
                    onChange={this.keywordOnChanged}
                    value={keyword}
                    maxLength={40}
                    placeholder={resource.role_assignment_search_user} />
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
                        {item.duration && item.duration > 0 ? <p>{this.formatToMinutes(item.duration)}</p> : <p>Short Video</p>}
                        <h4 onClick={e => this.view(e, item)}>{item.title}</h4>
                        <p>{item.channelTitle}<i className='date'>{item.publishedAt.toDateString()}</i></p>
                      </section>
                    </li>
                  );
                })}
              </ul>
              {this.state.nextPageToken && <button type='button' id='btnMore' name='btnMore' className='btn-more' onClick={this.loadMore}>{resource.button_more}</button>}
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
                    allowFullScreen={true}
                  />
                </div>
                <h3>{video.title}</h3>
                <h4>{video.channelTitle}<i className='date'>{video.publishedAt.toDateString()}</i></h4>
                <p>{video.description}</p>
              </div>
            </form>
            <Comments videoId={video.id} getCommentThreads={this.getCommentThreads} getComments={this.getComments} />
          </div>}
        </div>
      </div>
    );
  }
}

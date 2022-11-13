import { Comment, CommentThead } from './comment';
import { Cache, formatBigThumbnail, formatThumbnail, getComments, getCommentThreads, removeCache } from './common-client';
import { CategorySnippet, Channel, ChannelDetail, ChannelFilter, ChannelSnippet, HttpRequest, Item, ItemFilter, ListDetail, ListItem, ListResult, Playlist, PlaylistFilter, PlaylistSnippet, PlaylistVideo, PlaylistVideoSnippet, SearchId, SearchSnippet, Video, VideoCategory, VideoItemDetail, VideoSnippet, YoutubeListResult, YoutubeVideoDetail } from './models';
import { CommentOrder, VideoService } from './service';
import { fromYoutubeCategories, fromYoutubeChannels, fromYoutubePlaylist, fromYoutubePlaylists, fromYoutubeSearch, fromYoutubeVideos, getYoutubeSort } from './youtube';

export class YoutubeClient implements VideoService {
  private channelCache: Cache<Channel>;
  private playlistCache: Cache<Playlist>;
  constructor(private key: string, private httpRequest: HttpRequest, private maxChannel: number = 40, private maxPlaylist: number = 200) {
    this.channelCache = {};
    this.playlistCache = {};
    this.getCagetories = this.getCagetories.bind(this);
    this.getChannels = this.getChannels.bind(this);
    this.getChannel = this.getChannel.bind(this);
    this.getChannelPlaylists = this.getChannelPlaylists.bind(this);
    this.getPlaylists = this.getPlaylists.bind(this);
    this.getPlaylist = this.getPlaylist.bind(this);
    this.getPlaylistVideos = this.getPlaylistVideos.bind(this);
    this.getChannelVideos = this.getChannelVideos.bind(this);
    this.getPopularVideos = this.getPopularVideos.bind(this);
    this.getPopularVideosByRegion = this.getPopularVideosByRegion.bind(this);
    this.getPopularVideosByCategory = this.getPopularVideosByCategory.bind(this);
    this.getVideos = this.getVideos.bind(this);
    this.getVideo = this.getVideo.bind(this);
    this.search = this.search.bind(this);
    this.getRelatedVideos = this.getRelatedVideos.bind(this);
    this.searchVideos = this.searchVideos.bind(this);
    this.searchPlaylists = this.searchPlaylists.bind(this);
    this.searchChannels = this.searchChannels.bind(this);
    this.getCommentThreads = this.getCommentThreads.bind(this);
    this.getComments = this.getComments.bind(this);
  }
  getCagetories(regionCode?: string): Promise<VideoCategory[]> {
    if (!regionCode) {
      regionCode = 'US';
    }
    const url = `https://www.googleapis.com/youtube/v3/videoCategories?key=AIzaSyDVRw8jjqyJWijg57zXSOMpUArlZGpC7bE&regionCode=${regionCode}`;
    return this.httpRequest.get<YoutubeListResult<ListItem<string, CategorySnippet, any>>>(url).then(res => fromYoutubeCategories(res));
  }
  getChannels(ids: string[]): Promise<Channel[]> {
    const url = `https://www.googleapis.com/youtube/v3/channels?key=${this.key}&id=${ids.join(',')}&part=snippet,contentDetails`;
    return this.httpRequest.get<YoutubeListResult<ListItem<string, ChannelSnippet, ChannelDetail>>>(url).then(res => formatThumbnail(fromYoutubeChannels(res)));
  }
  getChannel(id: string): Promise<Channel|null|undefined> {
    const c = this.channelCache[id];
    if (c) {
      return Promise.resolve(c.item);
    } else {
      return this.getChannels([id]).then(res => {
        const channel = res && res.length > 0 ? res[0] : null;
        if (channel) {
          const d = new Date();
          this.channelCache[id] = { item: channel, timestamp: d};
          if (channel.customUrl && channel.customUrl.length > 0) {
            this.channelCache[channel.customUrl] = { item: channel, timestamp: d};
          }
          removeCache(this.channelCache, this.maxChannel);
        }
        return channel;
      });
    }
  }
  getChannelPlaylists(channelId: string, max?: number, nextPageToken?: string): Promise<ListResult<Playlist>> {
    const maxResults = (max && max > 0 ? max : 50);
    const pageToken = (nextPageToken ? `&pageToken=${nextPageToken}` : '');
    const url = `https://youtube.googleapis.com/youtube/v3/playlists?key=${this.key}&channelId=${channelId}&maxResults=${maxResults}${pageToken}&part=snippet,contentDetails`;
    return this.httpRequest.get<YoutubeListResult<ListItem<string, PlaylistSnippet, ListDetail>>>(url).then(res => fromYoutubePlaylists(res));
  }
  getPlaylists(ids: string[]): Promise<Playlist[]> {
    const url = `https://youtube.googleapis.com/youtube/v3/playlists?key=${this.key}&id=${ids.join(',')}&part=snippet,contentDetails`;
    return this.httpRequest.get<YoutubeListResult<ListItem<string, PlaylistSnippet, ListDetail>>>(url).then(res => {
      const r = fromYoutubePlaylists(res);
      r.list = formatBigThumbnail(r.list);
      return r.list;
    });
  }
  getPlaylist(id: string): Promise<Playlist|null|undefined> {
    const c = this.playlistCache[id];
    if (c) {
      return Promise.resolve(c.item);
    } else {
      return this.getPlaylists([id]).then(res => {
        const playlist = res && res.length > 0 ? res[0] : null;
        if (playlist) {
          this.playlistCache[id] = { item: playlist, timestamp: new Date() };
          removeCache(this.playlistCache, this.maxPlaylist);
        }
        return playlist;
      });
    }
  }
  getPlaylistVideos(playlistId: string, max?: number, nextPageToken?: string): Promise<ListResult<PlaylistVideo>> {
    const maxResults = (max && max > 0 ? max : 50);
    const pageToken = (nextPageToken ? `&pageToken=${nextPageToken}` : '');
    const url = `https://youtube.googleapis.com/youtube/v3/playlistItems?key=${this.key}&playlistId=${playlistId}&maxResults=${maxResults}${pageToken}&part=snippet,contentDetails`;
    return this.httpRequest.get<YoutubeListResult<ListItem<string, PlaylistVideoSnippet, VideoItemDetail>>>(url).then(res => {
      const r = fromYoutubePlaylist(res);
      r.list = formatThumbnail(r.list);
      return r;
    });
  }
  getChannelVideos(channelId: string, max?: number, nextPageToken?: string): Promise<ListResult<PlaylistVideo>> {
    return this.getChannel(channelId).then(channel => {
      if (channel && channel.uploads) {
        return this.getPlaylistVideos(channel.uploads, max, nextPageToken);
      } else {
        return {list: []};
      }
    });
  }
  getPopularVideos(regionCode?: string, videoCategoryId?: string, max?: number, nextPageToken?: string): Promise<ListResult<Video>> {
    if ((!regionCode || regionCode.length === 0) && (!videoCategoryId || videoCategoryId.length === 0)) {
      regionCode = 'US';
    }
    const regionParam = regionCode && regionCode.length > 0 ? `&regionCode=${regionCode}` : '';
    const categoryParam = videoCategoryId && videoCategoryId.length > 0 ? `&videoCategoryId=${videoCategoryId}` : '';
    const maxResults = (max && max > 0 ? max : 50);
    const pageToken = (nextPageToken ? `&pageToken=${nextPageToken}` : '');
    const url = `https://youtube.googleapis.com/youtube/v3/videos?key=${this.key}&chart=mostPopular${regionParam}${categoryParam}&maxResults=${maxResults}${pageToken}&part=snippet,contentDetails`;
    return this.httpRequest.get<YoutubeListResult<ListItem<string, VideoSnippet, YoutubeVideoDetail>>>(url).then(res => {
      const r = fromYoutubeVideos(res);
      r.list = formatBigThumbnail(r.list);
      return r;
    });
  }
  getPopularVideosByRegion(regionCode?: string, max?: number, nextPageToken?: string): Promise<ListResult<Video>> {
    return this.getPopularVideos(regionCode, undefined, max, nextPageToken);
  }
  getPopularVideosByCategory(videoCategoryId?: string, max?: number, nextPageToken?: string): Promise<ListResult<Video>> {
    return this.getPopularVideos(undefined, videoCategoryId, max, nextPageToken);
  }
  getVideos(ids: string[], fields?: string[], noSnippet?: boolean): Promise<Video[]> {
    if (!ids || ids.length === 0) {
      return Promise.resolve([]);
    }
    const strSnippet = (noSnippet ? '' : 'snippet,');
    const url = `https://www.googleapis.com/youtube/v3/videos?key=${this.key}&part=${strSnippet}contentDetails&id=${ids.join(',')}`;
    return this.httpRequest.get<YoutubeListResult<ListItem<string, VideoSnippet, YoutubeVideoDetail>>>(url).then(res => {
      const r = fromYoutubeVideos(res);
      if (!r || !r.list) {
        return [];
      }
      return formatBigThumbnail(r.list);
    });
  }
  getVideo(id: string, fields?: string[], noSnippet?: boolean): Promise<Video|null|undefined> {
    return this.getVideos([id], fields, noSnippet).then(res => res && res.length > 0 ? res[0] : null);
  }
  getCommentThreads(videoId: string, sort?: CommentOrder, max?: number, nextPageToken?: string): Promise<ListResult<CommentThead>> {
    return getCommentThreads(this.httpRequest, this.key, videoId, sort, max, nextPageToken);
  }
  getComments(id: string, max?: number, nextPageToken?: string): Promise<ListResult<Comment>> {
    return getComments(this.httpRequest, this.key, id, max, nextPageToken);
  }
  search(sm: ItemFilter, max?: number, nextPageToken?: string | number): Promise<ListResult<Item>> {
    const searchType = sm.type ? `&type=${sm.type}` : '';
    const searchDuration = (sm.duration === 'long' || sm.duration === 'medium' || sm.duration === 'short') ? `&videoDuration=${sm.duration}` : '';
    const s = getYoutubeSort(sm.sort);
    const searchOrder = (s ? `&order=${s}` : '');
    const regionParam = (sm.regionCode && sm.regionCode.length > 0 ? `&regionCode=${sm.regionCode}` : '');
    const pageToken = (nextPageToken ? `&pageToken=${nextPageToken}` : '');
    const maxResults = (max && max > 0 ? max : 50); // maximum is 50
    const url = `https://www.googleapis.com/youtube/v3/search?key=${this.key}&part=snippet${regionParam}&q=${sm.q}&maxResults=${maxResults}${searchType}${searchDuration}${searchOrder}${pageToken}`;
    return this.httpRequest.get<YoutubeListResult<ListItem<SearchId, SearchSnippet, any>>>(url).then(res => fromYoutubeSearch(res));
  }
  searchVideos(sm: ItemFilter, max?: number, nextPageToken?: string | number): Promise<ListResult<Item>> {
    sm.type = 'video';
    return this.search(sm, max, nextPageToken);
  }
  searchPlaylists(sm: PlaylistFilter, max?: number, nextPageToken?: string | number): Promise<ListResult<Playlist>> {
    const s: any = sm;
    s.type = 'playlist';
    return this.search(s, max, nextPageToken).then(res => {
      const list = res.list.map(i => {
        const p: Playlist = {
          id: i.id,
          title: i.title,
          description: i.description,
          publishedAt: i.publishedAt,
          thumbnail: i.thumbnail,
          mediumThumbnail: i.mediumThumbnail,
          highThumbnail: i.highThumbnail,
          channelId: i.channelId,
          channelTitle: i.channelTitle
        };
        return p;
      });
      return { list, total: res.total, limit: res.limit, nextPageToken: res.nextPageToken };
    });
  }
  searchChannels(sm: ChannelFilter, max?: number, nextPageToken?: string | number): Promise<ListResult<Channel>> {
    const s: any = sm;
    s.type = 'channel';
    return this.search(s, max, nextPageToken).then(res => {
      const list = res.list.map(i => {
        const p: Channel = {
          id: i.id,
          title: i.title,
          description: i.description,
          publishedAt: i.publishedAt,
          thumbnail: i.thumbnail,
          mediumThumbnail: i.mediumThumbnail,
          highThumbnail: i.highThumbnail,
          channelId: i.channelId,
          channelTitle: i.channelTitle
        };
        return p;
      });
      return { list, total: res.total, limit: res.limit, nextPageToken: res.nextPageToken };
    });
  }
  getRelatedVideos(videoId: string, max?: number, nextPageToken?: string): Promise<ListResult<Item>> {
    return this.getPopularVideos('US').then(list => list as any);
    /*
    const maxResults = (max && max > 0 ? max : 24);
    const pageToken = (nextPageToken ? `&pageToken=${nextPageToken}` : '');
    const url = `https://youtube.googleapis.com/youtube/v3/search?key=${this.key}&relatedToVideoId=${videoId}&type=video&regionCode=VN&maxResults=${maxResults}${pageToken}&part=snippet`;
    return this.httpRequest.get<YoutubeListResult<ListItem<SearchId, SearchSnippet, any>>>(url).then(res => fromYoutubeSearch(res));
    */
  }
}

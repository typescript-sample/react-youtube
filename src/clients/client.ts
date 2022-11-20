import { Comment, CommentThead } from './comment';
import { Cache, decompress, decompressItems, formatTypes, formatThumbnail, fromYoutubeSearch, getComments, getCommentThreads, removeCache } from './common-client';
import { Channel, ChannelFilter, HttpRequest, Item, ItemFilter, ListItem, ListResult, Playlist, PlaylistFilter, PlaylistVideo, SearchId, SearchSnippet, Thumbnail, Video, VideoCategory, YoutubeListResult } from './models';
import { CommentOrder, VideoService } from './service';

export interface CsvService {
  fromString(value: string): Promise<string[][]>;
}
// tslint:disable-next-line:class-name
export class resources {
  static ignoreDate?: boolean;
  static csv: CsvService | ((value: string) => Promise<string[][]>);
}
export class DefaultCsvService {
  constructor(private c: any) {
    this._csv = c;
    this.fromString = this.fromString.bind(this);
  }
  private _csv: any;
  fromString(value: string): Promise<string[][]> {
    return new Promise(resolve => {
      this._csv({ noheader: true, output: 'csv' }).fromString(value).then((v: string[][] | PromiseLike<string[][]>) => resolve(v));
    });
  }
}
export function fromString(value: string): Promise<string[][]> {
  const x = resources.csv;
  if (typeof x === 'function') {
    return x(value);
  } else {
    return x.fromString(value);
  }
}
export function fromCsv<T>(fields: string[], csv: string): Promise<ListResult<T>> {
  return fromString(csv).then(items => {
    const arr: any[] = [];
    for (let i = 1; i < items.length; i++) {
      const obj: any = {};
      const len = Math.min(fields.length, items[i].length);
      for (let j = 0; j < len; j++) {
        obj[fields[j]] = items[i][j];
      }
      arr.push(obj);
    }
    const x: ListResult<T> = {
      total: parseFloat(items[0][0]),
      nextPageToken: items[0][1],
      list: arr
      // last: (items[0][0] === '1')
    };
    if (items[0].length > 1 && items[0][1].length > 0) {
      x.nextPageToken = items[0][1];
    }
    return x;
  });
}
// tslint:disable-next-line:max-classes-per-file
export class VideoClient implements VideoService {
  private channelCache: Cache<Channel>;
  private playlistCache: Cache<Playlist>;
  getCommentThreads?: (videoId: string, sort?: CommentOrder, max?: number, nextPageToken?: string) => Promise<ListResult<CommentThead>>;
  getComments?: (id: string, max?: number, nextPageToken?: string) => Promise<ListResult<Comment>>;
  constructor(private url: string, private httpRequest: HttpRequest, private maxChannel: number = 40, private maxPlaylist: number = 200, private key?: string) {
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
    if (key && key.length > 0) {
      this.getCommentThreads = (videoId: string, sort?: CommentOrder, max?: number, nextPageToken?: string): Promise<ListResult<CommentThead>> => {
        return getCommentThreads(httpRequest, key, videoId, sort, max, nextPageToken);
      };
      this.getComments = (id: string, max?: number, nextPageToken?: string): Promise<ListResult<Comment>> => {
        return getComments(httpRequest, key, id, max, nextPageToken);
      };
    }
  }
  getCagetories(regionCode?: string): Promise<VideoCategory[]> {
    if (!regionCode) {
      regionCode = 'US';
    }
    const url = `${this.url}/category?regionCode=${regionCode}`;
    return this.httpRequest.get<VideoCategory[]>(url);
  }
  getChannels(ids: string[], fields?: string[]): Promise<Channel[]> {
    const url = `${this.url}/channels/list?id=${ids.join(',')}&fields=${fields}`;
    return this.httpRequest.get<Channel[]>(url).then(res => formatTypes(res));
  }
  getChannel(id: string, fields?: string[]): Promise<Channel|null|undefined> {
    const c = this.channelCache[id];
    if (c) {
      return Promise.resolve(c.item);
    } else {
      const field = fields ? `?fields=${fields}` : '';
      const url = `${this.url}/channels/${id}${field}`;
      return this.httpRequest.get<Channel>(url).then(channel => {
        if (channel) {
          if (channel.publishedAt) {
            channel.publishedAt = new Date(channel.publishedAt);
          }
          this.channelCache[id] = {item: channel, timestamp: new Date()};
          removeCache(this.channelCache, this.maxChannel);
        }
        return channel;
      }).catch(err => {
        const data = (err &&  err.response) ? err.response : err;
        if (data && (data.status === 404 || data.status === 410)) {
          return null;
        }
        throw err;
      });
    }
  }
  getChannelPlaylists(channelId: string, max?: number, nextPageToken?: string, fields?: string[]): Promise<ListResult<Playlist>> {
    const maxResults = (max && max > 0 ? max : 50);
    const pageToken = (nextPageToken ? `&nextPageToken=${nextPageToken}` : '');
    const field = fields ? `&fields=${fields}` : '';
    const url = `${this.url}/playlists?channelId=${channelId}&limit=${maxResults}${pageToken}${field}`;
    return this.httpRequest.get<ListResult<Playlist>>(url).then(res => toPlaylists(res, fields));
  }
  getPlaylists(ids: string[], fields?: string[]): Promise<Playlist[]> {
    const field = fields ? `&fields=${fields}` : '';
    const url = `${this.url}/playlists/list?id=${ids.join(',')}${field}`;
    return this.httpRequest.get<Playlist[]>(url).then(res => formatTypes(res));
  }
  getPlaylist(id: string, fields?: string[]): Promise<Playlist|null|undefined> {
    const c = this.playlistCache[id];
    if (c) {
      return Promise.resolve(c.item);
    } else {
      const field = fields ? `?fields=${fields}` : '';
      const url = `${this.url}/playlists/${id}${field}`;
      return this.httpRequest.get<Playlist>(url).then(playlist => {
        if (playlist) {
          if (playlist.publishedAt) {
            playlist.publishedAt = new Date(playlist.publishedAt);
          }
          this.playlistCache[id] = {item: playlist, timestamp: new Date()};
          removeCache(this.playlistCache, this.maxPlaylist);
        }
        return playlist;
      }).catch(err => {
        const data = (err &&  err.response) ? err.response : err;
        if (data && (data.status === 404 || data.status === 410)) {
          return null;
        }
        throw err;
      });
    }
  }
  getPlaylistVideos(playlistId: string, max?: number, nextPageToken?: string, fields?: string[]): Promise<ListResult<PlaylistVideo>> {
    const maxResults = (max && max > 0 ? max : 50);
    const pageToken = (nextPageToken ? `&nextPageToken=${nextPageToken}` : '');
    const field = fields ? `&fields=${fields}` : '';
    const url = `${this.url}/videos?playlistId=${playlistId}&limit=${maxResults}${pageToken}${field}`;
    return this.httpRequest.get<string|ListResult<PlaylistVideo>>(url).then(res => toList<PlaylistVideo>(res, fields));
  }
  getChannelVideos(channelId: string, max?: number, nextPageToken?: string, fields?: string[]): Promise<ListResult<PlaylistVideo>> {
    const maxResults = (max && max > 0 ? max : 50);
    const pageToken = (nextPageToken ? `&nextPageToken=${nextPageToken}` : '');
    const field = fields ? `&fields=${fields}` : '';
    const url = `${this.url}/videos?channelId=${channelId}&limit=${maxResults}${pageToken}${field}`;
    return this.httpRequest.get<string|ListResult<PlaylistVideo>>(url).then(res => toList<PlaylistVideo>(res, fields));
  }
  getPopularVideos(regionCode?: string, videoCategoryId?: string, max?: number, nextPageToken?: string, fields?: string[]): Promise<ListResult<Video>> {
    if ((!regionCode || regionCode.length === 0) && (!videoCategoryId || videoCategoryId.length === 0)) {
      regionCode = 'US';
    }
    const regionParam = regionCode && regionCode.length > 0 ? `&regionCode=${regionCode}` : '';
    const categoryParam = videoCategoryId && videoCategoryId.length > 0 ? `&categoryId=${videoCategoryId}` : '';
    const maxResults = (max && max > 0 ? max : 50);
    const pageToken = (nextPageToken ? `&nextPageToken=${nextPageToken}` : '');
    const field = fields ? `&fields=${fields}` : '';
    const url = `${this.url}/videos/popular?limit=${maxResults}${pageToken}${regionParam}${categoryParam}${field}`;
    return this.httpRequest.get<string|ListResult<Video>>(url).then(res => toList<Video>(res, fields));
  }
  getPopularVideosByRegion(regionCode?: string, max?: number, nextPageToken?: string, fields?: string[]): Promise<ListResult<Video>> {
    return this.getPopularVideos(regionCode, undefined, max, nextPageToken, fields);
  }
  getPopularVideosByCategory(videoCategoryId?: string, max?: number, nextPageToken?: string, fields?: string[]): Promise<ListResult<Video>> {
    return this.getPopularVideos(undefined, videoCategoryId, max, nextPageToken, fields);
  }
  getVideos(ids: string[], fields?: string[], noSnippet?: boolean): Promise<Video[]> {
    if (!ids || ids.length === 0) {
      return Promise.resolve([]);
    }
    const field = fields ? `&fields=${fields}` : '';
    const url = `${this.url}/videos/list?id=${ids.join(',')}${field}`;
    return this.httpRequest.get<Video[]>(url).then(res => formatTypes(res));
  }
  getRelatedVideos(videoId: string, max?: number, nextPageToken?: string, fields?: string[]): Promise<ListResult<Item>> {
    if (!videoId || videoId.length === 0) {
      const r: ListResult<Item> = {list: []};
      return Promise.resolve(r);
    }
    const maxResults = (max && max > 0 ? max : 50);
    const pageToken = (nextPageToken ? `&nextPageToken=${nextPageToken}` : '');
    const field = fields ? `&fields=${fields}` : '';
    const url = `${this.url}/videos/${videoId}/related?limit=${maxResults}${pageToken}${field}`;
    return this.httpRequest.get<ListResult<Item>>(url).then(res => toList<Item>(res, fields));
  }
  getVideo(id: string, fields?: string[], noSnippet?: boolean): Promise<Video|null|undefined> {
    const field = fields ? `?fields=${fields}` : '';
    const url = `${this.url}/videos/${id}${field}`;
    return this.httpRequest.get<Video>(url).then(video => {
      if (video && video.publishedAt) {
        video.publishedAt = new Date(video.publishedAt);
      }
      return video;
    }).catch(err => {
      const data = (err &&  err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return null;
      }
      throw err;
    });
  }
  search(sm: ItemFilter, max?: number, nextPageToken?: string|number): Promise<ListResult<Item>> {
    const searchType = sm.type ? `&type=${sm.type}` : '';
    const searchDuration = sm.type === 'video' && (sm.duration === 'long' || sm.duration === 'medium' || sm.duration === 'short') ? `&videoDuration=${sm.duration}` : '';
    const searchOrder = (sm.sort === 'date' || sm.sort === 'rating' || sm.sort === 'title' || sm.sort === 'count' || sm.sort === 'viewCount' ) ? `&sort=${sm.sort}` : '';
    const regionParam = (sm.regionCode && sm.regionCode.length > 0 ? `&regionCode=${sm.regionCode}` : '');
    const pageToken = (nextPageToken ? `&pageToken=${nextPageToken}` : '');
    const maxResults = (max && max > 0 ? max : 50); // maximum is 50
    const url = `https://www.googleapis.com/youtube/v3/search?key=${this.key}&part=snippet${regionParam}&q=${sm.q}&maxResults=${maxResults}${searchType}${searchDuration}${searchOrder}${pageToken}`;
    return this.httpRequest.get<YoutubeListResult<ListItem<SearchId, SearchSnippet, any>>>(url).then(res => {
      const r = fromYoutubeSearch(res);
      r.list = formatThumbnail(r.list);
      return r;
    });
  }
  searchVideos(sm: ItemFilter, max?: number, nextPageToken?: string|number, fields?: string[]): Promise<ListResult<Item>> {
    const searchDuration = sm.type === 'video' && (sm.duration === 'long' || sm.duration === 'medium' || sm.duration === 'short') ? `&videoDuration=${sm.duration}` : '';
    const searchOrder = (sm.sort === 'date' || sm.sort === 'rating' || sm.sort === 'title' || sm.sort === 'count' || sm.sort === 'viewCount' ) ? `&sort=${sm.sort}` : '';
    const regionParam = (sm.regionCode && sm.regionCode.length > 0 ? `&regionCode=${sm.regionCode}` : '');
    const pageToken = (nextPageToken ? `&nextPageToken=${nextPageToken}` : '');
    const maxResults = (max && max > 0 ? max : 50); // maximum is 50
    const field = fields ? `&fields=${fields}` : '';
    const url = `${this.url}/videos/search?q=${sm.q}${searchDuration}${regionParam}${searchOrder}${pageToken}${field}&limit=${maxResults}`;
    return this.httpRequest.get<ListResult<Item>>(url).then(res => toList<Item>(res, fields));
  }
  searchPlaylists(sm: PlaylistFilter, max?: number, nextPageToken?: string|number, fields?: string[]): Promise<ListResult<Playlist>> {
    const searchOrder = (sm.sort === 'date' || sm.sort === 'rating' || sm.sort === 'title' || sm.sort === 'count' || sm.sort === 'viewCount' ) ? `&sort=${sm.sort}` : '';
    const pageToken = (nextPageToken ? `&nextPageToken=${nextPageToken}` : '');
    const maxResults = (max && max > 0 ? max : 50); // maximum is 50
    const field = fields ? `&fields=${fields}` : '';
    const url = `${this.url}/playlists/search?q=${sm.q}${searchOrder}${pageToken}${field}&limit=${maxResults}`;
    return this.httpRequest.get<ListResult<Playlist>>(url).then(res => toPlaylists(res, fields));
  }
  searchChannels(sm: ChannelFilter, max?: number, nextPageToken?: string|number, fields?: string[]): Promise<ListResult<Channel>> {
    const searchOrder = (sm.sort === 'date' || sm.sort === 'rating' || sm.sort === 'title' || sm.sort === 'count' || sm.sort === 'viewCount' ) ? `&sort=${sm.sort}` : '';
    const pageToken = (nextPageToken ? `&nextPageToken=${nextPageToken}` : '');
    const maxResults = (max && max > 0 ? max : 50); // maximum is 50
    const field = fields ? `&fields=${fields}` : '';
    const url = `${this.url}/channels/search?q=${sm.q}${searchOrder}${pageToken}${field}&limit=${maxResults}`;
    return this.httpRequest.get<string|ListResult<Channel>>(url).then(res2 => {
      if (typeof res2 === 'string' && fields && fields.length > 0) {
        return fromCsv<Channel>(fields, res2).then(res => {
          formatTypes<Channel>(res.list);
          const r: ListResult<Channel> = {
            list: res.list,
            nextPageToken: res.nextPageToken,
          };
          return r;    
        });
      } else {
        const res: ListResult<Channel> = res2 as any;
        formatTypes<Channel>(res.list);
        const r: ListResult<Channel> = {
          list: res.list,
          nextPageToken: res.nextPageToken,
        };
        return r;
      }
    });
  }
}
interface PublishedAt {
  publishedAt?: Date;
}
interface Id {
  id?: string;
}
export function toPlaylists(res2: string|ListResult<Playlist>, fields?: string[]): Promise<ListResult<Playlist>> {
  if (typeof res2 === 'string' && fields && fields.length > 0) {
    return fromCsv<Playlist>(fields, res2).then(res => {
      formatTypes<Playlist>(res.list);
      const r: ListResult<Playlist> = {
        list: decompressItems(res.list),
        nextPageToken: res.nextPageToken,
      };
      return r;    
    });
  } else {
    const res: ListResult<Playlist> = res2 as any;
    formatTypes<Playlist>(res.list);
    const r: ListResult<Playlist> = {
      list: decompressItems(res.list),
      nextPageToken: res.nextPageToken,
    };
    return Promise.resolve(r);
  }
}
export function toList<T extends Id & Thumbnail & PublishedAt>(res2: string|ListResult<T>, fields?: string[]): Promise<ListResult<T>> {
  if (typeof res2 === 'string' && fields && fields.length > 0) {
    return fromCsv<T>(fields, res2).then(res => {
      formatTypes<T>(res.list);
      const r: ListResult<T> = {
        list: decompress(res.list),
        nextPageToken: res.nextPageToken,
      };
      return r;
    });
  } else {
    const res: ListResult<T> = res2 as any;
    formatTypes<T>(res.list);
    const r: ListResult<T> = {
      list: decompress(res.list),
      nextPageToken: res.nextPageToken,
    };
    return Promise.resolve(r);
  }
}

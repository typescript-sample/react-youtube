import {Comment, CommentThead} from './comment';
import {Channel, ChannelFilter, Item, ItemFilter, ListResult, Playlist, PlaylistFilter, PlaylistVideo, Video, VideoCategory} from './models';

export interface SubscriptionsService {
  getSubscriptions(channelId: string, fields?: string[]): Promise<Channel[]>;
}
export type CommentOrder = 'time' | 'relevance';
export type TextFormat = 'html' | 'plainText';
export interface VideoService {
  getCagetories(regionCode?: string): Promise<VideoCategory[]>;
  getChannels(ids: string[], fields?: string[]): Promise<Channel[]>;
  getChannel(id: string, fields?: string[]): Promise<Channel|null|undefined>;
  getChannelPlaylists(channelId: string, max?: number, nextPageToken?: string, fields?: string[]): Promise<ListResult<Playlist>>;
  getPlaylists(ids: string[], fields?: string[]): Promise<Playlist[]>;
  getPlaylist(id: string, fields?: string[]): Promise<Playlist|null|undefined>;
  getChannelVideos(channelId: string, max?: number, nextPageToken?: string, fields?: string[]): Promise<ListResult<PlaylistVideo>>;
  getPlaylistVideos(playlistId: string, max?: number, nextPageToken?: string, fields?: string[]): Promise<ListResult<PlaylistVideo>>;
  getPopularVideos(regionCode?: string, videoCategoryId?: string, max?: number, nextPageToken?: string, fields?: string[]): Promise<ListResult<Video>>;
  getVideos(ids: string[], fields?: string[]): Promise<Video[]>;
  getVideo(id: string, fields?: string[]): Promise<Video|null|undefined>;
  search(sm: ItemFilter, max?: number, nextPageToken?: string | number, fields?: string[]): Promise<ListResult<Item>>;
  getRelatedVideos?(videoId: string, max?: number, nextPageToken?: string, fields?: string[]): Promise<ListResult<Item>>;
  searchVideos(sm: ItemFilter, max?: number, nextPageToken?: string | number, fields?: string[]): Promise<ListResult<Item>>;
  searchPlaylists(sm: PlaylistFilter, max?: number, nextPageToken?: string | number, fields?: string[]): Promise<ListResult<Playlist>>;
  searchChannels(sm: ChannelFilter, max?: number, nextPageToken?: string | number, fields?: string[]): Promise<ListResult<Channel>>;
  /**
   * @param videoId
   * @param order relevance, time (default)
   * @param nextPageToken
   */
  getCommentThreads?(videoId: string, order?: CommentOrder, max?: number, nextPageToken?: string): Promise<ListResult<CommentThead>>;
  getComments?(id: string, max?: number, nextPageToken?: string): Promise<ListResult<Comment>>;
  getPopularVideosByRegion?(regionCode?: string, max?: number, nextPageToken?: string, fields?: string[]): Promise<ListResult<Video>>;
  getPopularVideosByCategory?(videoCategoryId?: string, max?: number, nextPageToken?: string, fields?: string[]): Promise<ListResult<Video>>;
}

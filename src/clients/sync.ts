import { formatThumbnail } from './common-client';
import { Channel, ChannelDetail, ChannelSnippet, HttpRequest, ListDetail, ListItem, ListResult, Playlist, PlaylistSnippet, PlaylistVideo, PlaylistVideoSnippet, SyncListResult, Video, VideoCategory, VideoItemDetail, VideoSnippet, YoutubeListResult, YoutubeVideoDetail } from './models';
import { fromYoutubeChannels, fromYoutubePlaylist, fromYoutubePlaylists, fromYoutubeVideos } from './youtube';

export interface ChannelSync {
  id: string;
  uploads?: string;
  syncTime?: Date;
  level?: number;
}
export interface PlaylistCollection {
  id: string;
  videos: string[];
}
export interface CategoryCollection {
  id: string;
  data: VideoCategory[];
}
export interface SyncRepository {
  getChannelSync(channelId: string): Promise<ChannelSync|null|undefined>;
  saveChannel(channel: Channel): Promise<number>;
  savePlaylist(playlist: Playlist): Promise<number>;
  savePlaylists(playlist: Playlist[]): Promise<number>;
  saveChannelSync(channel: ChannelSync): Promise<number>;
  saveVideos(videos: Video[]): Promise<number>;
  savePlaylistVideos(playlistId: string, videos: string[]): Promise<number>;
  getVideoIds(id: string[]): Promise<string[]>;
}
export interface SyncClient {
  getChannel(id: string): Promise<Channel|null|undefined>;
  getPlaylist(id: string): Promise<Playlist|null|undefined>;
  getChannelPlaylists(channelId: string, max?: number, nextPageToken?: string): Promise<SyncListResult<Playlist>>;
  getPlaylistVideos(playlistId: string, max?: number, nextPageToken?: string): Promise<SyncListResult<PlaylistVideo>>;
  getVideos(ids: string[]): Promise<Video[]>;
  getSubscriptions?(channelId: string): Promise<Channel[]>;
}
export interface SyncService {
  syncChannel(channelId: string): Promise<number>;
  syncChannels(channelIds: string[]): Promise<number>;
  syncPlaylist(playlistId: string, level?: number): Promise<number>;
  syncPlaylists(playlistIds: string[], level?: number): Promise<number>;
}

export function getNewVideos(videos: PlaylistVideo[], lastSynchronizedTime?: Date): PlaylistVideo[] {
  if (!lastSynchronizedTime) {
    return videos;
  }
  const timestamp = addSeconds(lastSynchronizedTime, -1800);
  const time = timestamp.getTime();
  const newVideos: PlaylistVideo[] = [];
  for (const i of videos) {
    if (i.publishedAt.getTime() >= time) {
      newVideos.push(i);
    } else {
      return newVideos;
    }
  }
  return newVideos;
}
export function addSeconds(date: Date, number: number): Date {
  const newDate = new Date(date);
  newDate.setSeconds(newDate.getSeconds() + number);
  return newDate;
}
export function notIn(ids: string[], subIds: string[], nosort?: boolean) {
  if (nosort) {
    const newIds: string[] = [];
    for (const id of ids) {
      if (!subIds.includes(id)) {
        newIds.push(id);
      }
    }
    return newIds;
  } else {
    const newIds: string[] = [];
    for (const id of ids) {
      const i = binarySearch(subIds, id);
      if (i < 0) {
        newIds.push(id);
      }
    }
    return newIds;
  }
}
export function binarySearch<T>(items: T[], value: T) {
  let startIndex = 0;
  let stopIndex = items.length - 1;
  let middle = Math.floor((stopIndex + startIndex) / 2);

  while (items[middle] !== value && startIndex < stopIndex) {
    // adjust search area
    if (value < items[middle]) {
      stopIndex = middle - 1;
    } else if (value > items[middle]) {
      startIndex = middle + 1;
    }
    // recalculate middle
    middle = Math.floor((stopIndex + startIndex) / 2);
  }
  // make sure it's the right value
  return (items[middle] !== value) ? -1 : middle;
}

export class YoutubeSyncClient implements SyncClient {
  constructor(private key: string, private httpRequest: HttpRequest) {
    this.getChannels = this.getChannels.bind(this);
    this.getChannel = this.getChannel.bind(this);
    this.getChannelPlaylists = this.getChannelPlaylists.bind(this);
    this.getPlaylists = this.getPlaylists.bind(this);
    this.getPlaylist = this.getPlaylist.bind(this);
    this.getPlaylistVideos = this.getPlaylistVideos.bind(this);
    this.getVideos = this.getVideos.bind(this);
  }
  private getChannels(ids: string[]): Promise<Channel[]> {
    const url = `https://www.googleapis.com/youtube/v3/channels?key=${this.key}&id=${ids.join(',')}&part=snippet,contentDetails`;
    return this.httpRequest.get<YoutubeListResult<ListItem<string, ChannelSnippet, ChannelDetail>>>(url).then(res => formatThumbnail(fromYoutubeChannels(res)));
  }
  getChannel(id: string): Promise<Channel|null|undefined> {
    return this.getChannels([id]).then(res => {
      const channel = res && res.length > 0 ? res[0] : null;
      return channel;
    });
  }
  private getPlaylists(ids: string[]): Promise<Playlist[]> {
    const url = `https://youtube.googleapis.com/youtube/v3/playlists?key=${this.key}&id=${ids.join(',')}&part=snippet,contentDetails`;
    return this.httpRequest.get<YoutubeListResult<ListItem<string, PlaylistSnippet, ListDetail>>>(url).then(res => {
      const r = fromYoutubePlaylists(res);
      return r.list;
    });
  }
  getPlaylist(id: string): Promise<Playlist|null|undefined> {
    return this.getPlaylists([id]).then(res => {
      const playlist = res && res.length > 0 ? res[0] : null;
      return playlist;
    });
  }
  getChannelPlaylists(channelId: string, max?: number, nextPageToken?: string): Promise<SyncListResult<Playlist>> {
    const maxResults = (max && max > 0 ? max : 50);
    const pageToken = (nextPageToken ? `&pageToken=${nextPageToken}` : '');
    const url = `https://youtube.googleapis.com/youtube/v3/playlists?key=${this.key}&channelId=${channelId}&maxResults=${maxResults}${pageToken}&part=snippet,contentDetails`;
    return this.httpRequest.get<YoutubeListResult<ListItem<string, PlaylistSnippet, ListDetail>>>(url).then(res => fromYoutubePlaylists(res));
  }
  getPlaylistVideos(playlistId: string, max?: number, nextPageToken?: string): Promise<SyncListResult<PlaylistVideo>> {
    const maxResults = (max && max > 0 ? max : 50);
    const pageToken = (nextPageToken ? `&pageToken=${nextPageToken}` : '');
    const url = `https://youtube.googleapis.com/youtube/v3/playlistItems?key=${this.key}&playlistId=${playlistId}&maxResults=${maxResults}${pageToken}&part=snippet,contentDetails`;
    return this.httpRequest.get<YoutubeListResult<ListItem<string, PlaylistVideoSnippet, VideoItemDetail>>>(url).then(res => {
      const r = fromYoutubePlaylist(res);
      if (r.list) {
        r.list = r.list.filter(i => i.thumbnail);
      }
      return r;
    });
  }
  getVideos(ids: string[]): Promise<Video[]> {
    if (!ids || ids.length === 0) {
      return Promise.resolve([]);
    }
    const strSnippet = 'snippet,';
    const url = `https://www.googleapis.com/youtube/v3/videos?key=${this.key}&part=${strSnippet}contentDetails&id=${ids.join(',')}`;
    return this.httpRequest.get<YoutubeListResult<ListItem<string, VideoSnippet, YoutubeVideoDetail>>>(url).then(res => {
      const r = fromYoutubeVideos(res);
      if (!r || !r.list) {
        return [];
      }
      return r.list;
    });
  }
}
export class DefaultSyncService implements SyncService {
  constructor(private client: SyncClient, private repo: SyncRepository, private log?: (msg: any, ctx?: any) => void) {
    this.syncChannel = this.syncChannel.bind(this);
    this.syncChannels = this.syncChannels.bind(this);
    this.syncPlaylist = this.syncPlaylist.bind(this);
    this.syncPlaylists = this.syncPlaylists.bind(this);
  }
  syncChannel(channelId: string): Promise<number> {
    return syncChannel(channelId, this.client, this.repo, this.log);
  }
  syncChannels(channelIds: string[]): Promise<number> {
    return syncChannels(channelIds, this.client, this.repo);
  }
  syncPlaylist(playlistId: string, level?: number): Promise<number> {
    const syncVideos = level && level < 2 ? false : true;
    return syncPlaylist(playlistId, syncVideos, this.client, this.repo, this.log);
  }
  syncPlaylists(playlistIds: string[], level?: number): Promise<number> {
    const syncVideos = level && level < 2 ? false : true;
    return syncPlaylists(playlistIds, syncVideos, this.client, this.repo);
  }
}

export function syncChannels(channelIds: string[], client: SyncClient, repo: SyncRepository): Promise<number> {
  const promises = channelIds.map(channelId => syncChannel(channelId, client, repo));
  let sum = 0;
  return Promise.all(promises).then(res => {
    for (const num of res) {
      sum = sum + num;
    }
    return sum;
  });
}
export async function syncChannel(channelId: string, client: SyncClient, repo: SyncRepository, log?: (msg: any, ctx?: any) => void): Promise<number> {
  return repo.getChannelSync(channelId).then(channelSync => {
    if (channelSync) {
      return client.getChannel(channelId).then(channel => {
        if (!channel) {
          return Promise.resolve(0);
        } else {
          return checkAndSyncUploads(channel, channelSync, client, repo);
        }
      });
    } else {
      return Promise.resolve(0);
    }
  }).catch(err => {
    if (log) {
      log(err);
    }
    throw err;
  });
}
export function checkAndSyncUploads(channel: Channel, channelSync: ChannelSync, client: SyncClient, repo: SyncRepository): Promise<number> {
  if (!channel.uploads || channel.uploads.length === 0) {
    return Promise.resolve(0);
  } else {
    const date = new Date();
    const timestamp = channelSync ? channelSync.syncTime : undefined;
    const syncVideos = (!channelSync || (channelSync && channelSync.level && channelSync.level >= 2)) ? true : false;
    const syncCollection = (!channelSync || (channelSync && channelSync.level && channelSync.level >= 1)) ? true : false;
    return syncUploads(channel.uploads, client, repo, timestamp).then(r => {
      channel.lastUpload = r.timestamp;
      channel.count = r.count;
      channel.itemCount = r.all;
      return syncChannelPlaylists(channel.id, syncVideos, syncCollection, client, repo).then(res => {
        if (syncCollection) {
          channel.playlistCount = res.count;
          channel.playlistItemCount = res.all;
          channel.playlistVideoCount = res.videoCount;
          channel.playlistVideoItemCount = res.allVideoCount;
        }
        return repo.saveChannel(channel).then(c => {
          return repo.saveChannelSync({ id: channel.id, syncTime: date, uploads: channel.uploads });
        });
      });
    });
  }
}

export function syncPlaylists(playlistIds: string[], syncVideos: boolean, client: SyncClient, repo: SyncRepository): Promise<number> {
  const promises = playlistIds.map(playlistId => syncPlaylist(playlistId, syncVideos, client, repo));
  let sum = 0;
  return Promise.all(promises).then(res => {
    for (const num of res) {
      sum = sum + num;
    }
    return sum;
  });
}
export async function syncPlaylist(playlistId: string, syncVideos: boolean, client: SyncClient, repo: SyncRepository, log?: (msg: any, ctx?: any) => void): Promise<number> {
  try {
    const res = await syncPlaylistVideos(playlistId, syncVideos, client, repo);
    const playlist = await client.getPlaylist(playlistId);
    if (playlist) {
      playlist.itemCount = playlist.count;
      playlist.count = res.count;
      await repo.savePlaylist(playlist);
      await repo.savePlaylistVideos(playlistId, res.videos);
      return res.success;
    } else {
      return Promise.resolve(0);
    }
  } catch (err) {
    if (log) {
      log(err);
    }
    throw err;
  }
}

export interface VideoResult {
  success: number;
  count?: number;
  all?: number;
  videos: string[];
  timestamp?: Date;
}
export function syncVideosOfPlaylists(playlistIds: string[], syncVideos: boolean, saveCollection: boolean, client: SyncClient, repo: SyncRepository): Promise<number> {
  let sum = 0;
  if (saveCollection) {
    const promises = playlistIds.map(id => syncPlaylistVideos(id, syncVideos, client, repo).then(r => repo.savePlaylistVideos(id, r.videos)));
    return Promise.all(promises).then(res => {
      for (const num of res) {
        sum = sum + num;
      }
      return sum;
    });
  } else {
    const promises = playlistIds.map(id => syncPlaylistVideos(id, syncVideos, client, repo));
    return Promise.all(promises).then(res => {
      for (const num of res) {
        sum = sum + num.success;
      }
      return sum;
    });
  }
}
export interface PlaylistResult {
  count?: number;
  all?: number;
  videoCount?: number;
  allVideoCount?: number;
}
export async function syncChannelPlaylists(channelId: string, syncVideos: boolean, saveCollection: boolean, client: SyncClient, repo: SyncRepository): Promise<PlaylistResult> {
  let nextPageToken: string|undefined = '';
  let count = 0;
  let all = 0;
  let allVideoCount = 0;
  while (nextPageToken !== undefined) {
    const channelPlaylists: ListResult<Playlist> = await client.getChannelPlaylists(channelId, 50, nextPageToken);
    all = channelPlaylists.total ? channelPlaylists.total : 0;
    count = count + channelPlaylists.list.length;
    const playlistIds: string[] = [];
    for (const p of channelPlaylists.list) {
      playlistIds.push(p.id);
      if (p.count) {
        allVideoCount = allVideoCount + p.count;
      }
    }
    nextPageToken = channelPlaylists.nextPageToken;
    await repo.savePlaylists(channelPlaylists.list);
    await syncVideosOfPlaylists(playlistIds, syncVideos, saveCollection, client, repo);
  }
  return { count, all, allVideoCount };
}
export async function syncPlaylistVideos(playlistId: string, syncVideos: boolean, client: SyncClient, repo: SyncRepository): Promise<VideoResult> {
  let nextPageToken: string|undefined = '';
  let success = 0;
  let count = 0;
  let all = 0;
  let newVideoIds: string[] = [];
  while (nextPageToken !== undefined) {
    const playlistVideos: ListResult<PlaylistVideo> = await client.getPlaylistVideos(playlistId, 50, nextPageToken);
    if (playlistVideos.total) {
      all = playlistVideos.total;
    }
    count = count + playlistVideos.list.length;
    const videoIds = playlistVideos.list.map(item => item.id);
    newVideoIds = newVideoIds.concat(videoIds);
    const getVideos = syncVideos ? client.getVideos : undefined;
    const r = await saveVideos(playlistVideos.list, getVideos, repo);
    success = success + r;
    nextPageToken = playlistVideos.nextPageToken;
  }
  return { success, count, all, videos: newVideoIds };
}
export async function syncUploads(uploads: string, client: SyncClient, repo: SyncRepository, timestamp?: Date): Promise<VideoResult> {
  let nextPageToken: string|undefined = '';
  let success = 0;
  let count = 0;
  let all = 0;
  let last: Date|undefined;
  while (nextPageToken !== undefined) {
    const playlistVideos: ListResult<PlaylistVideo> = await client.getPlaylistVideos(uploads, 50, nextPageToken);
    if (playlistVideos.total) {
      all = playlistVideos.total;
    }
    count = count + playlistVideos.list.length;
    if (!last && playlistVideos.list.length > 0) {
      last = playlistVideos.list[0].publishedAt;
    }
    const newVideos = getNewVideos(playlistVideos.list, timestamp);
    nextPageToken = playlistVideos.list.length > newVideos.length ? undefined : playlistVideos.nextPageToken;
    const r = await saveVideos(newVideos, client.getVideos, repo);
    success = success + r;
  }
  return { success, count: success, all, timestamp: last, videos: [] };
}
export function saveVideos(newVideos: PlaylistVideo[], getVideos?: (ids: string[], fields?: string[], noSnippet?: boolean) => Promise<Video[]>, repo?: SyncRepository): Promise<number> {
  if (!newVideos || newVideos.length === 0) {
    return Promise.resolve(0);
  } else {
    if (!repo || !getVideos) {
      return Promise.resolve(newVideos.length);
    } else {
      const videoIds = newVideos.map(item => item.id);
      return repo.getVideoIds(videoIds).then(ids => {
        const newIds = notIn(videoIds, ids);
        if (newIds.length === 0) {
          return Promise.resolve(0);
        } else {
          return getVideos(newIds).then(videos => {
            if (videos && videos.length > 0) {
              return repo.saveVideos(videos).then(r => videos.length);
            } else {
              return Promise.resolve(0);
            }
          });
        }
      });
    }
  }
}

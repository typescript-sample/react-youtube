import { Comment, CommentSnippet, CommentThead, TopLevelCommentSnippet } from './comment';
import { BigThumbnail, HttpRequest, ListItem, ListResult, Thumbnail, YoutubeListResult } from './models';
import { CommentOrder } from './service';

export interface CacheItem<T> {
  item: T;
  timestamp: Date;
}
export interface Cache<T> {
  [key: string]: CacheItem<T>;
}
export function removeCache<T>(cache: Cache<T>, max: number): number {
  let keys = Object.keys(cache);
  if (keys.length <= max) {
    return 0;
  }
  let lastKey = '';
  let count = 0;
  while (true) {
    let last = new Date();
    for (const key of keys) {
      const obj = cache[key];
      if (obj.timestamp.getTime() > last.getTime()) {
        lastKey = key;
        last = obj.timestamp;
      }
    }
    delete cache[lastKey];
    count = count + 1;
    keys = Object.keys(cache);
    if (keys.length <= max) {
      return count;
    }
  }
}

export const nothumbnail = 'https://i.ytimg.com/img/no_thumbnail.jpg';
export function formatThumbnail<T extends Thumbnail>(t: T[]): T[] {
  if (!t) {
    return t;
  }
  for (const obj of t) {
    if (!obj.thumbnail) {
      obj.thumbnail = nothumbnail;
    }
    if (!obj.mediumThumbnail) {
      obj.mediumThumbnail = nothumbnail;
    }
    if (!obj.highThumbnail) {
      obj.highThumbnail = nothumbnail;
    }
  }
  return t;
}
export function formatBigThumbnail<T extends Thumbnail & BigThumbnail>(t: T[]): T[] {
  if (!t) {
    return t;
  }
  for (const obj of t) {
    if (!obj.thumbnail) {
      obj.thumbnail = nothumbnail;
    }
    if (!obj.mediumThumbnail) {
      obj.mediumThumbnail = nothumbnail;
    }
    if (!obj.highThumbnail) {
      obj.highThumbnail = nothumbnail;
    }
    if (!obj.standardThumbnail) {
      obj.standardThumbnail = nothumbnail;
    }
    if (!obj.maxresThumbnail) {
      obj.maxresThumbnail = nothumbnail;
    }
  }
  return t;
}
interface Id {
  id?: string;
}
export function decompress<T extends Id & Thumbnail>(items: T[]): T[] {
  for (const i of items) {
    i.mediumThumbnail = `https://i.ytimg.com/vi/${i.id}/mqdefault.jpg`;
    i.highThumbnail = `https://i.ytimg.com/vi/${i.id}/hqdefault.jpg`;
    i.thumbnail = `https://i.ytimg.com/vi/${i.id}/default.jpg`;
    (i as any)['standardThumbnail'] = `https://i.ytimg.com/vi/${i.id}/sddefault.jpg`;
    (i as any)['maxresThumbnail'] = `https://i.ytimg.com/vi/${i.id}/maxresdefault.jpg`;
  }
  return items;
}
export const thumbnails = ['thumbnail', 'mediumThumbnail', 'highThumbnail', 'maxresThumbnail', 'standardThumbnail'];
export const thumbnailNames = ['default', 'mqdefault', 'hqdefault', 'sddefault', 'maxresdefault'];
export function decompressItems<T>(items: T[]): T[] {
  for (const j of items) {
    const item: any = j;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < thumbnails.length; i++) {
      const a = thumbnails[i];
      if (item[a] && item[a].length > 0 && item[a].length < 36) {
        const u = `https://i.ytimg.com/vi/${item[a]}/${thumbnailNames[i]}.jpg`;
        item[a] = u;
      }
    }
  }
  return items;
}
interface PublishedAt {
  publishedAt?: Date;
}
export function formatPublishedAt<T extends PublishedAt>(li: T[]): T[] {
  if (li && li.length > 0) {
    for (const i of li) {
      if (i.publishedAt) {
        i.publishedAt = new Date(i.publishedAt);
      }
    }
  }
  return li;
}

export function getCommentThreads(request: HttpRequest, key: string, videoId: string, sort?: CommentOrder, max?: number, nextPageToken?: string): Promise<ListResult<CommentThead>> {
  const orderParam = (sort === 'relevance' ? `&order=${sort}` : '');
  const maxResults = (max && max > 0 ? max : 20); // maximum is 50
  const pageToken = (nextPageToken ? `&pageToken=${nextPageToken}` : '');
  const url = `https://www.googleapis.com/youtube/v3/commentThreads?key=${key}&videoId=${videoId}${orderParam}&maxResults=${maxResults}${pageToken}&part=snippet`;
  return request.get<YoutubeListResult<ListItem<string, TopLevelCommentSnippet, any>>>(url).then(res => fromYoutubeCommentThreads(res));
}
export function getComments(request: HttpRequest, key: string, id: string, max?: number, nextPageToken?: string): Promise<ListResult<Comment>> {
  const maxResults = (max && max > 0 ? max : 20); // maximum is 50
  const pageToken = (nextPageToken ? `&pageToken=${nextPageToken}` : '');
  const url = `https://www.googleapis.com/youtube/v3/comments?key=${key}&parentId=${id}&maxResults=${maxResults}${pageToken}&part=snippet`;
  return request.get<YoutubeListResult<ListItem<string, CommentSnippet, any>>>(url).then(res => fromYoutubeComments(res));
}
export function fromYoutubeCommentThreads(res: YoutubeListResult<ListItem<string, TopLevelCommentSnippet, any>>): ListResult<CommentThead> {
  const list = res.items.filter(i => i.snippet).map(item => {
    const snippet = item.snippet;
    const c = snippet.topLevelComment;
    const sn = c.snippet;
    const i: CommentThead = {
      id: item.id,
      videoId: snippet.videoId,
      textDisplay: sn.textDisplay,
      textOriginal: sn.textOriginal,
      authorDisplayName: sn.authorDisplayName,
      authorProfileImageUrl: sn.authorProfileImageUrl,
      authorChannelUrl: sn.authorProfileImageUrl,
      authorChannelId: sn.authorChannelId.value,
      canRate: sn.canRate,
      viewerRating: sn.viewerRating,
      likeCount: sn.likeCount,
      publishedAt: sn.publishedAt,
      updatedAt: sn.updatedAt,
      canReply: snippet.canReply,
      totalReplyCount: snippet.totalReplyCount,
      isPublic: snippet.isPublic
    };
    return i;
  });
  return { list, total: res.pageInfo.totalResults, limit: res.pageInfo.resultsPerPage, nextPageToken: res.nextPageToken };
}
export function fromYoutubeComments(res: YoutubeListResult<ListItem<string, CommentSnippet, any>>): ListResult<Comment> {
  const list = res.items.filter(i => i.snippet).map(item => {
    const snippet = item.snippet;
    const i: Comment = {
      id: item.id,
      parentId: snippet.parentId,
      textDisplay: snippet.textDisplay,
      textOriginal: snippet.textOriginal,
      authorDisplayName: snippet.authorDisplayName,
      authorProfileImageUrl: snippet.authorProfileImageUrl,
      authorChannelUrl: snippet.authorProfileImageUrl,
      authorChannelId: snippet.authorChannelId.value,
      canRate: snippet.canRate,
      viewerRating: snippet.viewerRating,
      likeCount: snippet.likeCount,
      publishedAt: snippet.publishedAt,
      updatedAt: snippet.updatedAt
    };
    return i;
  });
  return { list, total: res.pageInfo.totalResults, limit: res.pageInfo.resultsPerPage, nextPageToken: res.nextPageToken };
}

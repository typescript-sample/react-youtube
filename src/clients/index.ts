
import { StringMap, Title } from './models';

export * from './models';
export * from './comment';
export * from './service';
export * from './youtube';
export * from './sync';
export * from './common-client';
export * from './client';
export * from './youtube-client';

export const channelMap: StringMap = {
  publishedat: 'publishedAt',
  customurl: 'customUrl',
  localizedtitle: 'localizedTitle',
  localizeddescription: 'localizedDescription',
  mediumthumbnail: 'mediumThumbnail',
  highthumbnail: 'highThumbnail',
  lastupload: 'lastUpload',
  itemcount: 'itemCount',
  playlistcount: 'playlistCount',
  playlistitemcount: 'playlistItemCount',
  playlistvideocount: 'playlistVideoCount',
  playlistvideoitemcount: 'playlistVideoItemCount',
};
export const playlistMap: StringMap = {
  publishedat: 'publishedAt',
  channelid: 'channelId',
  channeltitle: 'channelTitle',
  localizedtitle: 'localizedTitle',
  localizeddescription: 'localizedDescription',
  mediumthumbnail: 'mediumThumbnail',
  highthumbnail: 'highThumbnail',
  standardthumbnail: 'standardThumbnail',
  maxresthumbnail: 'maxresThumbnail',
};
export const videoMap: StringMap = {
  publishedat: 'publishedAt',
  categoryid: 'categoryId',
  channelid: 'channelId',
  channeltitle: 'channelTitle',
  localizedtitle: 'localizedTitle',
  localizeddescription: 'localizedDescription',
  mediumthumbnail: 'mediumThumbnail',
  highthumbnail: 'highThumbnail',
  standardthumbnail: 'standardThumbnail',
  maxresthumbnail: 'maxresThumbnail',
  defaultaudiolanguage: 'defaultAudioLanguage',
  defaultlanguage: 'defaultLanguage',
  licensedcontent: 'licensedContent',
  livebroadcastcontent: 'liveBroadcastContent',
  blockedregions: 'blockedRegions',
  allowedregions: 'allowedRegions'
};
export const playlistFields = ['id', 'channelId', 'channelTitle', 'description',
  'highThumbnail', 'localizedDescription', 'localizedTitle',
  'maxresThumbnail', 'mediumThumbnail', 'publishedAt', 'standardThumbnail',
  'thumbnail', 'title', 'count', 'itemCount'];
export const channelFields = ['id', 'count', 'country', 'lastUpload', 'customUrl', 'description',
  'favorites', 'highThumbnail', 'itemCount', 'likes', 'localizedDescription', 'localizedTitle',
  'mediumThumbnail', 'publishedat', 'thumbnail', 'title', 'uploads',
  'count', 'itemCount', 'playlistCount', 'playlistItemCount', 'playlistVideoCount', 'playlistVideoItemCount'
];
export const videoFields = [
  'id', 'caption', 'categoryId', 'channelId', 'channelTitle', 'defaultAudioLanguage',
  'defaultLanguage', 'definition', 'description', 'dimension', 'duration', 'highThumbnail',
  'licensedContent', 'liveBroadcastContent', 'localizedDescription', 'localizedTitle', 'maxresThumbnail',
  'mediumThumbnail', 'projection', 'publishedAt', 'standardThumbnail', 'tags', 'thumbnail', 'title', 'blockedRegions', 'allowedRegions'
];
export function isEmpty(s: string): boolean {
  return !(s && s.length > 0);
}
export function getFields(fields: string[], all?: string[]): string[]|undefined {
  if (!fields || fields.length === 0) {
    return undefined;
  }
  const existFields: string[] = [];
  if (all) {
    for (const s of fields) {
      if (all.includes(s)) {
        existFields.push(s);
      }
    }
    if (existFields.length === 0) {
      return undefined;
    } else {
      return existFields;
    }
  } else {
    return fields;
  }
}
export function getLimit(limit?: number, d?: number): number {
  if (limit) {
    return limit;
  }
  if (d && d > 0) {
    return d;
  }
  return 48;
}
export function map<T>(obj: T, m?: StringMap): any {
  if (!m) {
    return obj;
  }
  const mkeys = Object.keys(m);
  if (mkeys.length === 0) {
    return obj;
  }
  const obj2: any = {};
  const keys = Object.keys(obj);
  for (const key of keys) {
    let k0 = m[key];
    if (!k0) {
      k0 = key;
    }
    obj2[k0] = (obj as any)[key];
  }
  return obj2;
}
export function mapArray<T>(results: T[], m?: StringMap): T[] {
  if (!m) {
    return results;
  }
  const mkeys = Object.keys(m);
  if (mkeys.length === 0) {
    return results;
  }
  const objs = [];
  const length = results.length;
  for (let i = 0; i < length; i++) {
    const obj = results[i];
    const obj2: any = {};
    const keys = Object.keys(obj);
    for (const key of keys) {
      let k0 = m[key];
      if (!k0) {
        k0 = key;
      }
      obj2[k0] = (obj as any)[key];
    }
    objs.push(obj2);
  }
  return objs;
}

export function buildShownItems<T extends Title>(keyword: string, all: T[], includeDescription?: boolean): T[] {
  if (!all) {
    return [];
  }
  if (!keyword || keyword === '') {
    return all;
  }
  const w = keyword.toLowerCase();
  if (includeDescription) {
    return all.filter(i => (i.title && i.title.toLowerCase().includes(w)) || (i.description && i.description.toLocaleLowerCase().includes(w)));
  } else {
    return all.filter(i => i.title && i.title.toLowerCase().includes(w));
  }
}

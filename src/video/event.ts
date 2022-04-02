import { MouseEvent } from 'react';
import { NavigateFunction } from 'react-router';

export const viewVideo = (videoId: string, e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>, navigate: NavigateFunction) => {
  if (e && e.preventDefault) {
    e.preventDefault();
  }
  navigate(`/${videoId}`);
};
export const viewPlaylist = (playlistId: string, e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>, navigate: NavigateFunction) => {
  if (e && e.preventDefault) {
    e.preventDefault();
  }
  navigate(`/playlists/${playlistId}`);
};
export const viewChannel = (channelId: string | undefined, e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>, navigate: NavigateFunction) => {
  if (e && e.preventDefault) {
    e.preventDefault();
  }
  navigate(`/channels/${channelId}`);
};

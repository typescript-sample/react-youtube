import { Route, Routes } from 'react-router-dom';
import ChannelPage from './channel';
import ChannelsPage from './channels';
import HomePage from './home';
import PlaylistPage from './playlist';
import SearchPage from './search';
import VideoPage from './video';

export function Video() {
  return (
    <Routes>
      <Route index={true} element={<HomePage/>} />
      <Route path='' element={<HomePage/>} />
      <Route path='home' element={<HomePage/>} />
      <Route path='search/*' element={<SearchPage />} />
      <Route path='channels' element={<ChannelsPage />} />
      <Route path='channels/:id' element={<ChannelPage />} />
      <Route path='playlists/:id' element={<PlaylistPage />} />
      <Route path=':id' element={<VideoPage />} />
    </Routes>
  );
}

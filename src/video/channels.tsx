import * as React from 'react';
import { Link } from 'react-router-dom';
import { HorizontalPlaylists } from 'react-videos';
import { Channel } from '../clients';
import { context } from './service';

export interface Props {
  getChannels: (ids: string[], fields?: string[]) => Promise<Channel[]>;
}
const ChannelsPage = () => {
  const videoService = context.getVideoService();
  const [channels, setChannels] = React.useState<Channel[]>([]);

  React.useEffect(() => {
    // const ids = ['UCH5_L3ytGbBziX0CLuYdQ1Q', 'UCWu91J5KWEj1bQhCBuGeJxw', 'UCq3Ci-h945sbEYXpVlw7rJg', 'UCBkqDNqao03ldC3u78-Pp8g', 'UCsooa4yRKGN_zEE8iknghZA', 'UCZ4AMrDcNrfy3X6nsU8-rPg'];
    const ids = ['UCH5_L3ytGbBziX0CLuYdQ1Q', 'UCBkqDNqao03ldC3u78-Pp8g', 'UCsooa4yRKGN_zEE8iknghZA', 'UCZ4AMrDcNrfy3X6nsU8-rPg', 'UCK7tptUDHh-RYDsdxO1-5QQ', 'UCFMkPeE8jiPirJMv9kttuIg', 'UCQMyhrt92_8XM0KgZH6VnRg', 'UCQD-0MjUbDBwm2UTVYr0Dag', 'UCKMnl27hDMKvch--noWe5CA', 'UCNIuvl7V8zACPpTmmNIqP2A'];
    videoService.getChannels(ids).then(res => setChannels(res));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className='view-container'>
      <div>
        {
          channels && channels.map(c => (
            <form key={c.id} className='list-result'>
              <h3 style={{ paddingLeft: '20px' }}><Link to={c.id}>{c.title}</Link></h3>
              <HorizontalPlaylists channelId={c.id} getChannelPlaylists={videoService.getChannelPlaylists} getPlaylistVideos={videoService.getPlaylistVideos} prefix='/channels/'/>
            </form>
          ))
        }
      </div>
    </div>
  );
};
export default ChannelsPage;

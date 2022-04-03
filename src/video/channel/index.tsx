import * as React from 'react';
import { useParams } from 'react-router-dom';
import { Channel } from 'video-service';
import { context } from '../service';
import ChannelPlaylists from './channel-playlists';
import ChannelSubscriptions from './channel-subscription';
import ChannelVideos from './channel-videos';
import Home from './home';

import './index.scss';

const channelFields = ['id', 'title', 'mediumThumbnail', 'channels'];

export default function ChannelPage() {
  const videoService = context.getVideoService();
  const { id } = useParams();
  const tabName = ['home', 'videos', 'playlists', 'channels'];
  const [selectTab, setSelectTab] = React.useState(0);
  const [channel, setChannel] = React.useState<Channel>();

  React.useEffect(() => {
    (async () => {
      if (id) {
        const res = await videoService.getChannel(id, channelFields);
        if (res) {
          setChannel(res);
        }
      }
    })();
  }, []);
  return (
    <div className='channel-page'>
      {
        channel && (
          <div className='channel-information'>
            <img
              className='channel-avatar'
              src={channel.mediumThumbnail}
              alt='Channel avatar'
              width='80'
              height='80'
            />
            <div className='inform-detail'>
              <div className='container'>
                <div className='channel-name'>
                  {channel.title}
                </div>
              </div>
            </div>
          </div>
        )
      }
      <div className='tabs'>
        {tabName.map((item, index) =>
          <Tab
            key={index}
            tabId={index}
            tabName={item}
            getState={selectTab}
            setState={setSelectTab}
          />
        )}
      </div>
      {selectTab === 0 && <Home />}
      {selectTab === 1 && <ChannelVideos getChannelVideos={videoService.getChannelVideos} />}
      {selectTab === 2 && <ChannelPlaylists getPlaylists={videoService.getChannelPlaylists} />}
      {selectTab === 3 && <ChannelSubscriptions getChannel={videoService.getChannel} />}
    </div>
  );
}
export interface Props {
  key: number;
  tabId: number;
  tabName: string;
  getState: number;
  setState: React.Dispatch<React.SetStateAction<number>>;
}
const Tab = (props: Props) => {
  const { tabId, getState, setState, tabName } = props;
  const handleOnClick = (id: number) => {
    setState(id);
  };
  return (
    <div>
      <button className={`tab ${getState === tabId && 'tab-actived'}`}
        onClick={() => handleOnClick(tabId)}
      >
        {tabName.toLocaleUpperCase()}
      </button>
    </div>
  );
};


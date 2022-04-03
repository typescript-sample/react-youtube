import * as React from 'react';
import { Link } from 'react-router-dom';
import { Channel, Video } from 'video-service';
import './index.scss';

const channelFields = ['channelTitle', 'thumbnail'];
export interface Props {
  video: Video;
  getChannel: (id: string, fields?: string[]) => Promise<Channel | null | undefined>;
}
export default function VideoInfoBox(props: Props) {
  const [collapsed, setCollapsed] = React.useState(true);
  const [channel, setChannel] = React.useState<Channel>();
  React.useEffect(() => {
    (async () => {
      if (props.video.channelId) {
        const res = await props.getChannel(props.video.channelId, channelFields);
        if (res) {
          setChannel(res);
        }
      }
    })();
  }, []);

  const handleClick = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className='video-info-container'>
      <div className='video-info'>
        <h3 className='video-title'>{props.video.title}</h3>
        <div className='publish'>{props.video.publishedAt.toDateString()}</div>
      </div>
      <div className='video-info-box'>
        <div className='top'>
          <img
            src={channel && channel.thumbnail}
            alt='Avatar'
            width={48}
            height={48}
          />
          <div className='channel-info'>
            <h4 className='channel-name'><Link to={`/channels/${props.video.channelId}`}>{props.video.channelTitle}</Link></h4>
          </div>
        </div>
        <div className={`video-description ${collapsed ? 'collapsed' : 'extended'} `}>
          <p dangerouslySetInnerHTML={{ __html: props.video.description ? props.video.description : '' }} />
        </div>
        <span
          className='btn-show'
          onClick={handleClick}
        >
          {collapsed ? 'SHOW MORE' : 'SHOW LESS'}
        </span>
      </div>
    </div>
  );
}

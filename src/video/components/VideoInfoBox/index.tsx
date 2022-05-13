import * as React from 'react';
import { Link } from 'react-router-dom';
import { Video } from 'video-service';
import './index.css';

// const channelFields = ['channelTitle', 'thumbnail'];
export interface Props {
  video: Video;
  channelThumbnail?: string;
  // getChannel: (id: string, fields?: string[]) => Promise<Channel | null | undefined>;
}
export function VideoInfoBox(props: Props) {
  const [collapsed, setCollapsed] = React.useState(true);
  /*
  const [channel, setChannel] = React.useState<Channel>();
  React.useEffect(() => {
    (() => {
      if (props.video.channelId) {
        props.getChannel(props.video.channelId, channelFields).then(res => {
          if (res) {
            setChannel(res);
          }
        });
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
*/
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
            src={props.channelThumbnail}
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

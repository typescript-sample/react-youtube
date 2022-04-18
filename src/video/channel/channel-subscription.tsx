import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useResource } from 'uione';
import { Channel } from 'video-service';
import './index.scss';

export interface Props {
  getChannel: (id: string, fields?: string[]) => Promise<Channel | null | undefined>;
}
export default function ChannelSubscriptions(props: Props) {
  const resource = useResource();
  const { id } = useParams();
  const [channels, setChannels] = React.useState<Channel[]>([]);
  React.useEffect(() => {
    (async () => {
      if (id) {
        const res = await props.getChannel(id);
        if (res) {
          setChannels(res.channels as Channel[]);
        }
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='channel-subscriptions'>
      <h3 className='title'>{resource.subscriptions}</h3>
      <div className='containers'>
        {channels && channels.map((x, i) => {
          return (
            <div className='box' key={i}>
              <div className='avatar'>
                <img
                  src={x.mediumThumbnail}
                  alt='Avatar Channel'
                />
              </div>
              <div className='title-channel'>{x.title}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import * as React from 'react';
import { useParams } from 'react-router-dom';
import { Channel } from '../video-service';
import './index.scss';

export interface Props {
  getChannel: (id: string, fields?: string[]) => Promise<Channel | null | undefined>;
}
export default function ChannelSubscriptions(props: Props) {
  const { id } = useParams();
  const [data, setData] = React.useState<Channel[]>([]);
  React.useEffect(() => {
    (async () => {
      if (id) {
        const res = await props.getChannel(id);
        if (res) {
          setData(res.channels as Channel[]);
        }
      }
    })();
  }, []);

  return (
    <div className='channel-subscriptions'>
      <h3 className='title'>Subscriptions</h3>
      <div className='containers'>
        {data && data.map((x, i) => {
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



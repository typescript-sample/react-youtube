import * as React from 'react';
import { ListResult, PlaylistVideo } from 'video-service';
import PlayButton from '../PlayButton';
import './index.scss';

export interface Props {
  id: string;
  thumbnail?: string;
  thumbnailSize: string;
  getVideos: (playlistId: string, max?: number, nextPageToken?: string, fields?: string[]) => Promise<ListResult<PlaylistVideo>>;
}
const Slide = (props: Props) => {
  const { id, thumbnail, thumbnailSize } = props;
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [play, setPlay] = React.useState(false);
  const [videos, setVideos] = React.useState<PlaylistVideo[]>([]);
  const [length, setLength] = React.useState(3);
  const [fetching, setFetching] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      if (id && fetching) {
        const res = await props.getVideos(id, 3);
        setVideos(res.list);
        setLength(res.list.length);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetching]);

  const next = () => {
    if (currentIndex < (length - 1)) {
      setCurrentIndex(prevState => prevState + 1);
    }
    setPlay(false);
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevState => prevState - 1);
    }
    setPlay(false);
  };

  const handlePlayVideo = () => {
    setPlay(true);
  };

  const handleFetch = () => {
    setFetching(true);
  };

  return (
    <div className='carousel-container cover' style={{ width: '100%' }} onMouseEnter={handleFetch}>
      <div className='carousel-wrapper'>
        <button type='button' onClick={prev} className='left-arrow'>
          &#10094;
        </button>
        {
          !play && <div className='play-container' onClick={handlePlayVideo}>
            <PlayButton />
          </div>
        }
        <div className='carousel-content-wrapper'>
          <div className='carousel-content' style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {
              videos && videos.length > 0 ? (
                videos.map((item, index) => (
                  currentIndex === index && play ? (
                    <iframe
                      key={item.title}
                      width='200'
                      height='200'
                      src={currentIndex === index ? `https://www.youtube.com/embed/${item.id}?autoplay=1` : `https://www.youtube.com/embed/${item.id}`}
                      title='YouTube video player'
                      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;'
                    />
                  ) : (
                    <img className='img-thumb' key={item.title} src={(item as any)[thumbnailSize]} alt='video thumbnail'/>
                  )
                ))
              ) : (
                <img src={thumbnail} alt='video thumbnail'/>
              )
            }
          </div>
        </div>
        <button type='button' onClick={next} className='right-arrow'>
          &#10095;
        </button>
      </div>
    </div>
  );
};
export default Slide;

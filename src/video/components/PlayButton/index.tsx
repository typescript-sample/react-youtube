import './index.scss';

const PlayButtonCustom = () => {
  return (
    <button className='video-play-button'>
      <svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 104 104' enableBackground='new 0 0 104 104' xmlSpace='preserve'>
        <path fill='rgba(255, 255, 255, 0.8)' strokeWidth={4} strokeMiterlimit={10} d='M26,35h52L52,81L26,35z' />
        <circle className='video-play-circle' fill='none' stroke='rgba(0,0,0,0.7)' strokeWidth={4} strokeMiterlimit={10} cx={52} cy={52} r={50} />
      </svg>
    </button>
  );
};
export default PlayButtonCustom;

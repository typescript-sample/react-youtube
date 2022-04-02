import * as React from 'react';
import './index.scss';

const LoadMoreButton = (obj: any) => {
  const { loadMore } = obj;
  return (
    <div className='btn-container'>
      <button className='btn-load-more' onClick={loadMore}>Load More</button>
    </div>
  );
};
export default LoadMoreButton;

import * as React from 'react';
import './index.scss';

const LoadMoreButton = (obj: any) => {
  const { loadMore } = obj;
  return (
    <div className='btn-container'>
      <a className='btn-load-more' onClick={loadMore}>Load More</a>
    </div>
  );
};
export default LoadMoreButton;

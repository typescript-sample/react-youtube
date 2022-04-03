import * as React from 'react';
import { VideoCategory } from 'video-service';
import './index.scss';
import { TabCategory } from './TabCategory';

export interface Props {
  data: VideoCategory[];
  setSelectedTab: React.Dispatch<React.SetStateAction<string | undefined>>;
}
export default function CategoriesTab(props: Props) {
  const ref = React.useRef(null);
  const { data, setSelectedTab } = props;
  const [previousBtnHide, setPreviousBtnHide] = React.useState(true);
  const [nextBtnHide, setNextBtnHide] = React.useState(false);

  const scroll = (scrollOffset: number) => {
    if (ref.current) {
      const cur: any = ref.current;
      if (cur) {
        if (cur.scrollLeft) {
          cur.scrollLeft += scrollOffset;
        }
        const { scrollLeft, scrollWidth, clientWidth } = cur;
        const scrollMaxWidth = scrollWidth - clientWidth;
        if (scrollLeft < scrollMaxWidth) {
          setPreviousBtnHide(false);
          setNextBtnHide(false);
        }
        if (scrollLeft === scrollMaxWidth) {
          setNextBtnHide(true);
        }
        if (!scrollLeft) {
          setPreviousBtnHide(true);
        }
      }
    }
  };

  return (
    <div className='categories-tab'>
      <div className='container'>
        <button
          className={`btn ${previousBtnHide && 'btn-hide'}`}
          onClick={() => scroll(-101)}
        >
          &#8249;
        </button>
        <div className='tabs' ref={ref}>
          {data.map((item: VideoCategory) => {
            return (
              item.assignable ?
              <TabCategory
                key={item.id}
                id={item.id}
                name={item.title}
                setSelectedTab={setSelectedTab}
              /> : null
            );
          })}
        </div>
        <button
          className={`btn ${nextBtnHide && 'btn-hide'}`}
          onClick={() => scroll(101)}
        >
          &#8250;
        </button>
      </div>
    </div>
  );
}

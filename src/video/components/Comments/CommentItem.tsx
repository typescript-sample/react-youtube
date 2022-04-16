import * as React from 'react';
import { Comment, ListResult } from 'video-service';

export interface CommentProps {
  commentId: string;
  totalReplyCount?: number;
  authorProfileImageUrl: string;
  authorDisplayName: string;
  likeCount: number;
  textDisplay: string;
  getComments?: (id: string, max?: number, nextPageToken?: string) => Promise<ListResult<Comment>>;
}

const CommentItem = (props: CommentProps) => {
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [show, setShow] = React.useState(false);
  const [nextPage, setNextPage] = React.useState<string>();
  React.useEffect(() => {
    (async () => {
      if (props.getComments && props.commentId && show && !comments.length) {
        const res = await props.getComments(props.commentId, 5);
        setNextPage(res.nextPageToken);
        setComments(res.list);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const handleShowMore = () => {
    setShow(!show);
  };

  const loadMore = async (id: string) => {
    if (props.getComments) {
      const res = await props.getComments(id, 5, nextPage);
      setNextPage(res.nextPageToken);
      const newList = [...comments].concat(res.list);
      setComments(newList);
    }
  };

  return (
    !props.getComments ? null : <div className='row comments'>
      <div className='col s12 m2 l2 xl1'>
        <div className='img-user'>
          <img src={props.authorProfileImageUrl} alt='Author Profile'/>
        </div>
      </div>
      <div className='col s12 m10 l10 xl11'>
        <h3 className='author'>
          {props.authorDisplayName}
        </h3>
        <p dangerouslySetInnerHTML={{ __html: props.textDisplay }} />
        <h5>Like: {props.likeCount}</h5>
        {
          props.totalReplyCount && props.totalReplyCount > 0 && (
            <>
              <button className='view' onClick={handleShowMore}>{show ? 'Hide' : 'View'} {props.totalReplyCount} replies</button>
              {show && comments.map(c => (
                <>
                  <CommentItem
                    key={c.id}
                    commentId={c.id}
                    authorProfileImageUrl={c.authorProfileImageUrl}
                    authorDisplayName={c.authorDisplayName}
                    likeCount={c.likeCount}
                    textDisplay={c.textDisplay}
                  />
                </>
              ))}
            </>
          )
        }
        {nextPage && <button className='view' onClick={() => loadMore(props.commentId)}>View more replies</button>}
      </div>
    </div>
  );
};
export default CommentItem;

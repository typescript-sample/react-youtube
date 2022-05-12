import * as React from 'react';
import { Comment, CommentOrder, CommentThead, ListResult } from 'video-service';
import CommentItem from './CommentItem';
import './index.css';

interface CommentTools {
  nextPageToken?: string;
  order: CommentOrder;
}
interface CommentsProps {
  videoId?: string;
  getCommentThreads?: (videoId: string, order?: CommentOrder, max?: number, nextPageToken?: string) => Promise<ListResult<CommentThead>>;
  getComments?: (id: string, max?: number, nextPageToken?: string) => Promise<ListResult<Comment>>;
}
const Comments = (props: CommentsProps) => {
  const [commentThreads, setCommentThreads] = React.useState<CommentThead[]>([]);
  const [tools, setTools] = React.useState<CommentTools>({
    nextPageToken: '',
    order: 'time'
  });
  React.useEffect(() => {
    (async () => {
      if (props.videoId && props.getCommentThreads) {
        const res = await props.getCommentThreads(props.videoId,'relevance');
        setTools((prev) => ({ ...prev, nextPageToken: res.nextPageToken }));
        setCommentThreads(res.list);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSort = async (e: { target: { value: string }; }) => {
    if (props.videoId && props.getCommentThreads) {
      const sort = e.target.value as CommentOrder;
      const res = await props.getCommentThreads(props.videoId, sort);
      setTools((prev) => ({ ...prev, order: sort, nextPageToken: res.nextPageToken }));
      setCommentThreads(res.list);
    }
  };

  const loadMore = async () => {
    if (props.videoId && props.getCommentThreads) {
      const res = await props.getCommentThreads(props.videoId, tools.order, 20, tools.nextPageToken);
      setTools((prev) => ({ ...prev, nextPageToken: res.nextPageToken }));
      const newThreads = [...commentThreads].concat(res.list);
      setCommentThreads(newThreads);
    }
  };

  return (
    !props.getCommentThreads || !props.videoId ? null :
      <div className='comment-threads-container'>
        {
          commentThreads && (
            <div>
              <div className='comments-bar'>
                <h2 className='comments-total'>Comments</h2>
                <select className='comments-sort' onChange={handleSort} defaultValue='relevance'>
                  <option value='relevance'>Top Comments</option>
                  <option value='time'>Newest First</option>
                </select>
              </div>
              {
                commentThreads.map(comment => (
                  <CommentItem
                    key={comment.id}
                    commentId={comment.id}
                    totalReplyCount={comment.totalReplyCount}
                    authorProfileImageUrl={comment.authorProfileImageUrl}
                    authorDisplayName={comment.authorDisplayName}
                    likeCount={comment.likeCount}
                    textDisplay={comment.textDisplay}
                    getComments={props.getComments}
                  />
                ))
              }
              {
                tools.nextPageToken && <button type='button' id='btnMore' name='btnMore' className='btn-more' onClick={loadMore}>Load More</button>
              }
            </div>
          )
        }
      </div>
  );
};
export default Comments;

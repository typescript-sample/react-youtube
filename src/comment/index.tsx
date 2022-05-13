import * as React from 'react';
import './comment.css';
import { CommentItem } from './CommentItem';
import { Comment, CommentOrder, CommentThead, ListResult } from './model';

export * from './CommentItem';
export * from './model';

interface CommentTools {
  nextPageToken?: string;
  order: CommentOrder;
}
interface CommentsProps {
  videoId?: string;
  getCommentThreads?: (videoId: string, order?: CommentOrder, max?: number, nextPageToken?: string) => Promise<ListResult<CommentThead>>;
  getComments?: (id: string, max?: number, nextPageToken?: string) => Promise<ListResult<Comment>>;
  order?: CommentOrder;
}
export const Comments = (props: CommentsProps) => {
  const [commentThreads, setCommentThreads] = React.useState<CommentThead[]>([]);
  const [tools, setTools] = React.useState<CommentTools>({
    nextPageToken: '',
    order: 'relevance'
  });
  React.useEffect(() => {
    (() => {

      if (props.videoId && props.getCommentThreads) {
        const oder = props.order ? props.order : tools.order
        props.getCommentThreads(props.videoId, oder).then(res => {
          setTools((prev) => ({ ...prev, nextPageToken: res.nextPageToken, order: oder }));
          setCommentThreads(res.list);
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSort = (e: { target: { value: string }; }) => {
    if (props.videoId && props.getCommentThreads) {
      const sort = e.target.value as CommentOrder;
      props.getCommentThreads(props.videoId, sort).then(res => {
        setTools((prev) => ({ ...prev, order: sort, nextPageToken: res.nextPageToken }));
        setCommentThreads(res.list);
      });
    }
  };

  const loadMore = () => {
    if (props.videoId && props.getCommentThreads) {
      props.getCommentThreads(props.videoId, tools.order, 20, tools.nextPageToken).then(res => {
        setTools((prev) => ({ ...prev, nextPageToken: res.nextPageToken }));
        const newThreads = [...commentThreads].concat(res.list);
        setCommentThreads(newThreads);
      });
    }
  };
  // return (!props.getCommentThreads || !props.videoId ? null :
  //   React.createElement("div", { className: 'comment-threads-container' }, commentThreads && (React.createElement("div", null,
  //     React.createElement("div", { className: 'comments-bar' },
  //       React.createElement("h2", { className: 'comments-total' }, "Comments"),
  //       React.createElement("select", { className: 'comments-sort', onChange: handleSort, defaultValue: 'relevance' },
  //         React.createElement("option", { value: 'relevance' }, "Top Comments"),
  //         React.createElement("option", { value: 'time' }, "Newest First"))),
  //     commentThreads.map(function (comment) { return (React.createElement(CommentItem, { key: comment.id, commentId: comment.id, totalReplyCount: comment.totalReplyCount, authorProfileImageUrl: comment.authorProfileImageUrl, authorDisplayName: comment.authorDisplayName, likeCount: comment.likeCount, textDisplay: comment.textDisplay, getComments: props.getComments })); }),
  //     tools.nextPageToken && React.createElement("button", { type: 'button', id: 'btnMore', name: 'btnMore', className: 'btn-more', onClick: loadMore }, "Load More")))));

  return (
    !props.getCommentThreads || !props.videoId ? null :
      <div className='comment-threads-container'>
        {
          commentThreads && (
            <div>
              <div className='comments-bar'>
                <h2 className='comments-total'>Comments</h2>
                <select className='comments-sort btn button' onChange={handleSort} defaultValue={tools.order}>
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

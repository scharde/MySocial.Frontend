import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Typography,
} from "@mui/material";
import { formatDateToNow } from "@/Utils/utils";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { ICommentRequest, ICommentResponse } from "@/model/Feed";
import { getCommentsAsync, postCommentsAsync } from "@/services/CommentService";
import InfiniteScroll from "react-infinite-scroll-component";

interface Props {
  postId: string;
  closeDialog: () => void;
}

const PostComments = (props: Props) => {
  const { postId, closeDialog } = props;
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<ICommentResponse[]>([]);
  const [totalComments, setTotalComments] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isAddingComment, setIsAddingComment] = useState<boolean>(false);

  useEffect(() => {
    loadCommentsAsync(page, pageSize);
  }, []);

  const loadCommentsAsync = async (lPage: number, lPageSize: number) => {
    const response = await getCommentsAsync(postId, lPage, lPageSize);
    if (response.items && response.items.length > 0) {
      const combined = [...comments, ...(response.items || [])];

      const uniqueComments = combined.filter(
        (post, index, self) =>
          index === self.findIndex((p) => p.id === post.id),
      );
      setComments(uniqueComments);
    }

    setTotalComments(response.totalCount);
    setPage(response.page);
    setPageSize(response.pageSize);
  };

  const fetchMoreComments = async () => {
    await loadCommentsAsync(page + 1, pageSize);
  };

  const { user } = useAppSelector((store: RootState) => store.userState);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setIsAddingComment(true);
      const response = await postCommentsAsync({
        postId: postId,
        content: newComment,
      } as ICommentRequest);
      // setComments([...comments, response.data.comment]);

      let clonedComments = [...comments];
      clonedComments.unshift(response);
      setNewComment("");
      setComments(clonedComments);
      setTotalComments(totalComments + 1);
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsAddingComment(false);
    }
  };

  const name = `${user?.firstName} ${user?.lastName}}`;

  return (
    <Dialog
      open={Boolean(postId)}
      onClose={() => closeDialog()}
      maxWidth="sm"
      fullWidth
    >
      <DialogContent
        id="postCommentsContentId"
        sx={{ maxHeight: "500px", overflowX: "auto" }}
      >
        <Typography variant="h6" gutterBottom>
          Comments
        </Typography>

        {/* Add Comment */}
        <Box display="flex" gap={2} mb={3}>
          <Avatar src={user?.avatar} alt={name}>
            {name?.charAt(0)}
          </Avatar>
          <TextField
            fullWidth
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            size="small"
          />
        </Box>

        {/* Comments List */}
        <Box>
          <InfiniteScroll
            dataLength={comments.length}
            next={fetchMoreComments}
            hasMore={totalComments > comments.length}
            loader={<h4>Loading...</h4>}
            endMessage={<p style={{ textAlign: "center" }}>No more comments</p>}
            scrollableTarget="postCommentsContentId"
          >
            {comments.map((comment) => (
              <Box key={comment.id} display="flex" gap={2} mb={2}>
                <Avatar
                  src={comment.author.avatar}
                  alt={comment.author.name}
                  sx={{ width: 32, height: 32 }}
                >
                  {comment.author.name.charAt(0)}
                </Avatar>
                <Box>
                  <Box
                    sx={(theme) => ({
                      borderRadius: 2,
                      paddingX: 1.5,
                      paddingBottom: 1.5,
                    })}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">
                      {comment.author.name}
                    </Typography>
                    <Typography variant="body2">{comment.content}</Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ ml: 1 }}
                  >
                    {formatDateToNow(comment.createdDateUtc)}
                  </Typography>
                </Box>
              </Box>
            ))}
          </InfiniteScroll>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => closeDialog()}>Cancel</Button>
        <Button
          onClick={handleAddComment}
          color="secondary"
          variant="contained"
          disabled={!newComment.trim() || isAddingComment}
        >
          {isAddingComment ? "Please wait" : "Comment"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PostComments;

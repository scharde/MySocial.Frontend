import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  Button,
  TextField,
  Box,
  Chip,
  Divider,
  Menu,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import {
  ThumbUp,
  ThumbDown,
  Comment,
  Share,
  Send,
  Bookmark,
  MoreVert,
  PersonAdd,
  PersonRemove,
} from "@mui/icons-material";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import {
  createPostActionAsync,
  getPostActionAsync,
  updateVoteAction,
} from "@/redux/feedSlice.";
import { ICommentRequest, ICommentResponse, VoteType } from "@/model/Feed";
import { postVotesAsync } from "@/services/PostService";
import { getCommentsAsync, postCommentsAsync } from "@/services/CommentService";
import { formatDistanceToNow } from "date-fns";
import { formatDateToNow } from "@/Utils/utils";
import { followUserAsync } from "@/services/userService";
import {
  followingToggleAction,
  getFollowingActionAsync,
} from "@/redux/userSlice";

export default function SocialFeed() {
  const [newPost, setNewPost] = useState("");
  const [postLoading, setPostLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [commentDialog, setCommentDialog] = useState<string | null>(null);
  const [comments, setComments] = useState<ICommentResponse[]>([]);
  const [newComment, setNewComment] = useState("");

  const dispatch = useAppDispatch();
  const { posts, page } = useAppSelector((state: RootState) => state.feedState);
  const { user, followingToIds } = useAppSelector(
    (store: RootState) => store.userState,
  );

  useEffect(() => {
    dispatch(getFollowingActionAsync());
  }, []);

  useEffect(() => {
    dispatch(getPostActionAsync(page));
  }, []);

  const name = `${user?.firstName} ${user?.lastName}}`;

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;

    setPostLoading(true);
    try {
      dispatch(createPostActionAsync(newPost));
      setNewPost("");
      dispatch(getPostActionAsync(page));
    } finally {
      setPostLoading(false);
    }
  };

  const handleVote = async (postId: string, vote: number) => {
    try {
      await postVotesAsync(postId, vote);
      dispatch(updateVoteAction({ postId: postId, vote: vote }));
    } catch (error) {
      console.error("Failed to vote:", error);
    }
  };

  const handleToggleFollow = async (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    try {
      await followUserAsync(post.author.id);
      dispatch(followingToggleAction({ followingToId: post.author.id }));
    } catch (error) {
      console.error("Failed to follow/unfollow:", error);
    }
  };

  const handleBookmark = async (postId: string) => {
    try {
      await axios.post(`/posts/${postId}/bookmark`);
    } catch (error) {
      console.error("Failed to bookmark:", error);
    }
  };

  const handleOpenComments = async (postId: string) => {
    setCommentDialog(postId);
    const response = await getCommentsAsync(postId, 1, 10);
    setComments(response.items);
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !commentDialog) return;
    try {
      const response = await postCommentsAsync({
        postId: commentDialog,
        content: newComment,
      } as ICommentRequest);
      // setComments([...comments, response.data.comment]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  return (
    <Box maxWidth="600px" mx="auto" p={2}>
      {/* Create Post */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" gap={2}>
            <Avatar src={user?.avatar} alt={name}>
              {name?.charAt(0)}
            </Avatar>
            <Box flex={1}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  onClick={handleCreatePost}
                  disabled={!newPost.trim() || postLoading}
                >
                  {postLoading ? <CircularProgress size={20} /> : "Post"}
                </Button>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      {posts.map((post) => {
        let isFollowing = followingToIds.includes(post.author.id);
        return (
          <Card key={post.id} sx={{ mb: 3 }}>
            <CardContent>
              {/* Post Header */}
              <Box
                display="flex"
                alignItems="flex-start"
                justifyContent="space-between"
                mb={2}
              >
                <Box display="flex" gap={2}>
                  <Avatar src={post.author.avatar} alt={post.author.name}>
                    {post.author.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {post.author.name}
                      </Typography>
                      {isFollowing && (
                        <Chip
                          label="Following"
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {post.author.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDateToNow(post.createdDateUtc)}
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  {!isFollowing && post.author.id !== user?.id && (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<PersonAdd />}
                      onClick={() => handleToggleFollow(post.id)}
                    >
                      Follow
                    </Button>
                  )}
                  {isFollowing && (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<PersonRemove />}
                      onClick={() => handleToggleFollow(post.id)}
                    >
                      Unfollow
                    </Button>
                  )}
                  <IconButton
                    onClick={(e) => {
                      setAnchorEl(e.currentTarget);
                      setSelectedPost(post.id);
                    }}
                  >
                    <MoreVert />
                  </IconButton>
                </Box>
              </Box>

              {/* Post Content */}
              <Typography variant="body1" sx={{ mb: 2 }}>
                {post.content}
              </Typography>

              {/* Engagement Stats */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography variant="body2" color="text.secondary">
                  {post.upVotes - post.downVotes} points • {post.commentCount}{" "}
                  comments
                </Typography>
              </Box>

              <Divider sx={{ mb: 1 }} />
            </CardContent>

            {/* Action Buttons */}
            <CardActions sx={{ justifyContent: "space-between", px: 2 }}>
              <Box display="flex" gap={1}>
                <Button
                  startIcon={<ThumbUp />}
                  onClick={() => handleVote(post.id, 1)}
                  color={
                    post.userVote === VoteType.UpVote ? "primary" : "inherit"
                  }
                  size="small"
                >
                  {post.upVotes}
                </Button>
                <Button
                  startIcon={<ThumbDown />}
                  onClick={() => handleVote(post.id, 2)}
                  color={
                    post.userVote === VoteType.DownVote ? "error" : "inherit"
                  }
                  size="small"
                >
                  {post.downVotes}
                </Button>
              </Box>

              <Box display="flex" gap={1}>
                <IconButton onClick={() => handleOpenComments(post.id)}>
                  <Comment />
                </IconButton>
                <IconButton>
                  <Share />
                </IconButton>
                <IconButton>
                  <Send />
                </IconButton>
                <IconButton
                  onClick={() => handleBookmark(post.id)}
                  color={post.userBookmarked ? "primary" : "default"}
                >
                  <Bookmark />
                </IconButton>
              </Box>
            </CardActions>
          </Card>
        );
      })}

      {/* Post Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => setAnchorEl(null)}>Save Post</MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>Hide Post</MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>Report Post</MenuItem>
      </Menu>

      {/* Comments Dialog */}
      <Dialog
        open={Boolean(commentDialog)}
        onClose={() => setCommentDialog(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
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
                  <Box sx={{ bgcolor: "grey.100", borderRadius: 2, p: 1.5 }}>
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommentDialog(null)}>Cancel</Button>
          <Button
            onClick={handleAddComment}
            variant="contained"
            disabled={!newComment.trim()}
          >
            Comment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

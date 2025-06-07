import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  Button,
  Box,
  Chip,
  Divider,
  Menu,
  MenuItem,
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
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { getPostActionAsync, updateVoteAction } from "@/redux/feedSlice.";
import { VoteType } from "@/model/Feed";
import { postVotesAsync } from "@/services/PostService";
import { formatDateToNow } from "@/Utils/utils";
import { followUserAsync } from "@/services/userService";
import {
  followingToggleAction,
  getFollowingActionAsync,
} from "@/redux/userSlice";
import NewPost from "@/Module/Feed/NewPost.";
import InfiniteScroll from "react-infinite-scroll-component";
import PostComments from "@/Module/Feed/PostComments";

export default function SocialFeed() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openCommentsPostId, setOpenCommentsPostId] = useState<string | null>(
    null,
  );
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const { posts, page, totalCount } = useAppSelector(
    (state: RootState) => state.feedState,
  );
  const { user, followingToIds } = useAppSelector(
    (store: RootState) => store.userState,
  );

  useEffect(() => {
    dispatch(getFollowingActionAsync());
  }, []);

  useEffect(() => {
    dispatch(getPostActionAsync(page));
  }, []);

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
      // await axios.post(`/posts/${postId}/bookmark`);
      console.warn("Not implemented");
    } catch (error) {
      console.error("Failed to bookmark:", error);
    }
  };

  const handleOpenComments = async (postId: string) => {
    setOpenCommentsPostId(postId);
  };

  const fetchMorePosts = async () => {
    await dispatch(getPostActionAsync(page + 1));
  };

  return (
    <Box maxWidth="600px" mx="auto" p={2}>
      {/* Create Post */}
      <NewPost />

      {/* Posts Feed */}
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchMorePosts}
        hasMore={totalCount > posts.length}
        loader={<h4>Loading...</h4>}
        endMessage={<p>No more posts</p>}
      >
        {posts.map((post) => {
          let isFollowing = followingToIds.includes(post.author?.id);
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
      </InfiniteScroll>

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

      {/*Comments Dialog */}
      {openCommentsPostId && (
        <PostComments
          postId={openCommentsPostId}
          closeDialog={() => setOpenCommentsPostId(null)}
        />
      )}
    </Box>
  );
}

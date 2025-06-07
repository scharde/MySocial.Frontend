import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { createPostActionAsync } from "@/redux/feedSlice.";
import { useState } from "react";

const NewPost = () => {
  const [newPost, setNewPost] = useState("");
  const [postLoading, setPostLoading] = useState(false);
  const dispatch = useAppDispatch();

  const { user, followingToIds } = useAppSelector(
    (store: RootState) => store.userState,
  );

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;

    setPostLoading(true);
    try {
      dispatch(createPostActionAsync(newPost));
      setNewPost("");
    } finally {
      setPostLoading(false);
    }
  };

  const name = `${user?.firstName} ${user?.lastName}}`;

  return (
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
  );
};

export default NewPost;

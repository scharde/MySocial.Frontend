import React from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import {
  ThumbUp,
  ChatBubbleOutline,
  Share,
  ThumbDown,
} from "@mui/icons-material";
import { IFeedPostResponse } from "@/model/Feed";

const FeedPost = ({ post }: { post: IFeedPostResponse }) => {
  return (
    <Card sx={{ maxWidth: 600, margin: "1rem auto", borderRadius: 2 }}>
      <CardHeader avatar={post.author.name} />
      <CardContent>
        <Typography variant="body1">{post.content}</Typography>
      </CardContent>
      <Divider />
      <CardActions disableSpacing sx={{ justifyContent: "space-around" }}>
        <Box sx={{ gap: 5 }}>
          <ThumbUp fontSize="small" />
          <ThumbDown fontSize="small" />
        </Box>
        <IconButton>
          <ChatBubbleOutline fontSize="small" />
          <Typography variant="body2" ml={0.5}>
            Comment
          </Typography>
        </IconButton>
        <IconButton>
          <Share fontSize="small" />
          <Typography variant="body2" ml={0.5}>
            Share
          </Typography>
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default FeedPost;

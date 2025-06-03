import { IFeedPostResponse } from "@/model/Feed";
import FeedPost from "./FeedPost";
import CssBaseline from "@mui/material/CssBaseline";
import React, { useEffect, useRef } from "react";
import AppTheme from "@/components/shared-theme/AppTheme";
import ColorModeSelect from "@/components/shared-theme/ColorModeSelect";
import { Card } from "@mui/material";
import Button from "@mui/material/Button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createPostActionAsync, getPostActionAsync } from "@/redux/feedSlice.";
import { Await } from "react-router-dom";
import { RootState } from "@/redux/store";

const Feeds = (props: { disableCustomTheme?: boolean }) => {
  const inputFeedRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const { posts, page } = useAppSelector((state: RootState) => state.feedState);

  useEffect(() => {
    dispatch(getPostActionAsync(page));
  }, []);

  const handlePostClick = async () => {
    let content = inputFeedRef.current?.value;
    await dispatch(createPostActionAsync(content || ""));
    dispatch(getPostActionAsync(page));
  };

  return (
    <>
      <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <ColorModeSelect
          sx={{ position: "fixed", top: "1rem", right: "1rem" }}
        />
        <Card variant="elevation">
          <input type="textbox" ref={inputFeedRef} />
          <Button type="submit" variant="contained" onClick={handlePostClick}>
            Post
          </Button>
        </Card>

        <Card>
          {posts &&
            posts.length > 0 &&
            posts.map((feed) => {
              return <FeedPost key={feed.id} post={feed} />;
            })}
        </Card>
      </AppTheme>
    </>
  );
};

export default Feeds;

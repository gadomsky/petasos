import AddIcon from "@mui/icons-material/Add";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useObserver } from "mobx-react-lite";
import React from "react";
import { useStore } from "../store/storeProvider";
import layout from "../styles/layout.css";
import { StyledButton } from "./styledMuiComponents";

export const NavigationBar = () => {
  const { topics, groups, dialogs } = useStore();

  return useObserver(() => {
    const homeText = groups.areGroupsHidden
      ? "Topics list"
      : "Groups and topics";
    return (
      <div className={layout.LayoutBody}>
        <div className={layout.LayoutNavigationBreadcrumbs}>
          <Breadcrumbs aria-label="breadcrumb">
            {topics.selectedTopic && (
              <Link
                component="button"
                color="textSecondary"
                onClick={() => topics.changeSelectedTopic(null)}
              >
                {homeText}
              </Link>
            )}
            {topics.selectedSubscription && (
              <Link
                component="button"
                color="textSecondary"
                onClick={() => topics.changeSelectedSubscription(null)}
              >
                {topics.selectedTopic.displayName}
              </Link>
            )}
            {topics.selectedSubscription && (
              <Typography variant="body2" color="textPrimary">
                {topics.selectedSubscription.name}
              </Typography>
            )}
            {topics.selectedTopic && !topics.selectedSubscription && (
              <Typography variant="body2" color="textPrimary">
                {topics.selectedTopic.displayName}
              </Typography>
            )}
            {!topics.selectedTopic && (
              <Typography variant="body2" color="textPrimary">
                {homeText}
              </Typography>
            )}
          </Breadcrumbs>
        </div>
        <div className={layout.LayoutNavigationButton}>
          <StyledButton
            color="secondary"
            variant="contained"
            onClick={() => dialogs.topic.setOpen(true)}
            startIcon={<AddIcon />}
            disabled={!groups.fetchTask.resolved}
          >
            Add topic
          </StyledButton>
        </div>
      </div>
    );
  });
};
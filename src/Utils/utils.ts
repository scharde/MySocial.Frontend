import { formatDistanceToNow } from "date-fns";

export const formatDateToNow = (createdDateUtc: Date) => {
  return formatDistanceToNow(createdDateUtc, {
    addSuffix: true,
  });
};

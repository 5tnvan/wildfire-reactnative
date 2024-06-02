import { fetchViewCount } from "../fetch/fetchViewCount";
import { calculateTotalViews } from "./calculateTotalViews";

/**
 * getTotalViews
 * fetch and calculate views
 * @returns views
 */

//archived

export const getTotalViews_archived = async (video_id: any) => {
    const res = await fetchViewCount(video_id);
    if (res?.length) return calculateTotalViews(res);
    else return 0
  }
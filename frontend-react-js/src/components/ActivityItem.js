import "./ActivityItem.css";

import { useNavigate } from "react-router-dom";
import ActivityContent from "components/ActivityContent";
import ActivityActionReply from "components/ActivityActionReply";
import ActivityActionRepost from "components/ActivityActionRepost";
import ActivityActionLike from "components/ActivityActionLike";
import ActivityActionShare from "components/ActivityActionShare";

export default function ActivityItem(props) {
  const navigate = useNavigate();

  const attrs = {};
  attrs.className = "activity_item clickable";
  attrs.onClick = () =>
    navigate(`/@${props.activity.handle}/status/${props.activity.uuid}`);

  return (
    <div {...attrs}>
      <div className="activity_main">
        <ActivityContent activity={props.activity} />
        {/* {expanded_meta} */}
        <div className="activity_actions">
          <ActivityActionReply
            setReplyActivity={props.setReplyActivity}
            activity={props.activity}
            setPopped={props.setPopped}
            activity_uuid={props.activity.uuid}
            count={props.activity.replies_count}
          />
          <ActivityActionRepost
            activity_uuid={props.activity.uuid}
            count={props.activity.reposts_count}
          />
          <ActivityActionLike
            activity_uuid={props.activity.uuid}
            count={props.activity.likes_count}
          />
          <ActivityActionShare activity_uuid={props.activity.uuid} />
        </div>
      </div>
    </div>
  );
}

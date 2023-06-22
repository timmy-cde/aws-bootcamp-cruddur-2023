import "./ActivityItem.css";

import { Link } from "react-router-dom";
import { format_datetime, time_future, time_ago } from "lib/DateTimeFormats";
import { ReactComponent as BombIcon } from "./svg/bomb.svg";

import ActivityActionReply from "components/ActivityActionReply";
import ActivityActionRepost from "components/ActivityActionRepost";
import ActivityActionLike from "components/ActivityActionLike";
import ActivityActionShare from "components/ActivityActionShare";

export default function ActivityShowItem(props) {
  let expanded_meta;
  if (props.expanded === true) {
    expanded_meta = (
      <div className="expandedMeta">
        <div className="created_at">
          {format_datetime(props.activity.created_at)}
        </div>
      </div>
    );
  }

  console.log("props: ", props)

  const avatarStyles = {
    backgroundImage: `url("https://assets.tmanuel.cloud/avatars/${props.activity.cognito_user_id}.jpg")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  let expires_at = (
    <div
      className="expires_at"
      title={format_datetime(props.activity.expires_at)}
    >
      <BombIcon className="icon" />
      <span className="ago">{time_future(props.activity.expires_at)}</span>
    </div>
  );

  const attrs = {};
  attrs.className = "activity_item expanded";

  return (
    <div {...attrs}>
      <div className="activity_main">
        <div className="activity_content_wrap">
          <Link
            className="activity_avatar"
            to={`/@` + props.activity.handle}
            style={avatarStyles}
          ></Link>
          <div className="activity_content">
            <div className="activity_meta">
              <div className="activity_identity">
                <Link
                  className="display_name"
                  to={`/@` + props.activity.handle}
                >
                  {props.activity.display_name}
                </Link>
                <Link className="handle" to={`/@` + props.activity.handle}>
                  @{props.activity.handle}
                </Link>
              </div>
              {/* activity_identity */}
              <div className="activity_times">
                <div
                  className="created_at"
                  title={format_datetime(props.activity.created_at)}
                >
                  <span className="ago">
                    {time_ago(props.activity.created_at)}
                  </span>
                </div>
                {expires_at}
              </div>
              {/* activity_times */}
            </div>
            {/* activity_meta */}
            <div className="message">{props.activity.message}</div>
          </div>
          {/* activity_content */}
        </div>
        {expanded_meta}
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

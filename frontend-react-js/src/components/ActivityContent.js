import './ActivityContent.css';

import { Link } from "react-router-dom";
import { format_datetime, time_future, time_ago } from '../lib/DateTimeFormats';
import { ReactComponent as BombIcon } from './svg/bomb.svg';
import AvatarStyle from "./AvatarStyle";

export default function ActivityContent(props) {
  console.log("props: ", props)
  let expires_at;
  if (props.activity.expires_at) {
    expires_at =  <div className="expires_at" title={format_datetime(props.activity.expires_at)}>
                    <BombIcon className='icon' />
                    <span className='ago'>{time_future(props.activity.expires_at)}</span>
                  </div>

  }
  let cognito_user_id = !props.profile
    ? props.activity.cognito_user_id
    : props.profile.cognito_user_uuid;

  return (
    <div className="activity_content_wrap">
      <Link
        className="activity_avatar"
        to={`/@` + props.activity.handle}
        style={AvatarStyle(cognito_user_id)}
      ></Link>
      <div className="activity_content">
        <div className="activity_meta">
          <div className="activity_identity">
            <Link className="display_name" to={`/@` + props.activity.handle}>
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
              <span className="ago">{time_ago(props.activity.created_at)}</span>
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
  );
}
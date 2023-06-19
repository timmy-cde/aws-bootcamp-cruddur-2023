import './Replies.css'
import ActivityItem from "./ActivityItem";

export default function Replies(props) {
  let content;
  console.log('replies: ', props.replies)
  if (props.replies.length === 0) {
    content = (
      <div className="replies_primer">
        <span>Nothing to see here yet</span>
      </div>
    );
  } else {
    content = (
      <div className="replies_feed_collection">
        {props.replies &&
          props.replies.map((activity) => {
            return (
              <ActivityItem
                setReplyActivity={props.setReplyActivity}
                setPopped={props.setPopped}
                key={activity.uuid}
                activity={activity}
              />
            );
          })}
      </div>
    );
  }

  return content;
}

import "./ProfileHeading.css";
import EditProfileButton from "../components/EditProfileButton";
import ProfileAvatar from "./ProfileAvatar";
import { useNavigate } from "react-router-dom";

export default function ProfileHeading(props) {
  const navigate = useNavigate();
  const backgroundImage =
    'url("https://assets.tmanuel.cloud/banners/larva-banner-1.jpg")';
  const styles = {
    backgroundImage: backgroundImage,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
  return (
    <div className="activity_feed_heading profile_heading">
      <div className="profile-block">
        <div className="back" onClick={() => navigate(-1)}>
          &larr;
        </div>
        <div className="profile-details">
          <div className="title">{props.profile.display_name}</div>
          <div className="cruds_count">{props.profile.cruds_count} Cruds</div>
        </div>
      </div>

      <div className="banner" style={styles}>
        <ProfileAvatar id={props.profile.cognito_user_uuid} />
      </div>

      <div className="info">
        <div className="id">
          <div className="display_name">{props.profile.display_name}</div>
          <div className="handle">@{props.profile.handle}</div>
        </div>
        <EditProfileButton setPopped={props.setPopped} />
      </div>
      <div className="bio">{props.profile.bio}</div>
    </div>
  );
}

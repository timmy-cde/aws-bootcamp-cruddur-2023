import "./ProfileAvatar.css";

export default function ProfileAvatar(props) {
  if (!props.id) return
  
  const backgroundImage = `url("https://assets.tmanuel.cloud/avatars/${props.id}.jpg")`;
  const styles = {
    backgroundImage: backgroundImage,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return <div className="profile-avatar" style={styles}></div>;
}
export default function AvatarStyle(cognito_user_id) {
  if (!cognito_user_id) {
    return
  }

  const avatarStyles = {
    backgroundImage: `url("https://assets.tmanuel.cloud/avatars/${cognito_user_id}.jpg")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return avatarStyles;
}
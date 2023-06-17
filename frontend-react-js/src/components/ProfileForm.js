import "./ProfileForm.css";
import React from "react";
import process from "process";
import { getAccessToken } from "lib/CheckAuth";
import { put } from 'lib/Requests';
import FormErrors from "components/FormErrors";

export default function ProfileForm(props) {
  const [bio, setBio] = React.useState(0);
  const [displayName, setDisplayName] = React.useState(0);
  const [errors, setErrors] = React.useState([]);

  React.useEffect(() => {
    setBio(props.profile.bio || "");
    setDisplayName(props.profile.display_name);
  }, [props.profile]);

  const s3Uploadkey = async (extension) => {
    console.log({ extension });
    try {
      const gateway_url = `${process.env.REACT_APP_API_GATEWAY_ENDPOINT}/avatars/key_upload`;
      await getAccessToken();
      const access_token = localStorage.getItem("access_token");
      const json = {
        extension: extension,
      };
      const res = await fetch(gateway_url, {
        method: "POST",
        headers: {
          Origin: process.env.REACT_APP_FRONTEND_URL,
          Authorization: `Bearer ${access_token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(json),
      });
      let data = await res.json();
      if (res.status === 200) {
        console.log("presigned url: ", data);
        return data.url;
      } else {
        console.log(res);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const s3Upload = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const filename = file.name;
    const size = file.size;
    const type = file.type;
    // const preview_image_url = URL.createObjectURL(file);
    console.log(filename, size, type);
    const fileparts = filename.split(".");
    const extension = fileparts[fileparts.length - 1];

    const presignedurl = await s3Uploadkey(extension);
    try {
      console.log("s3Uploadkey");
      const res = await fetch(presignedurl, {
        method: "PUT",
        headers: {
          "Content-Type": type,
        },
        body: file,
      });
      if (res.status === 200) {
      } else {
        console.log(res);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onsubmit = async (event) => {
    event.preventDefault();
    const backend_url = `${process.env.REACT_APP_BACKEND_URL}/api/profile/update`;
    const payload_data = {
      bio: bio,
      display_name: displayName,
    };

    put(backend_url, payload_data, setErrors, (data) => {
      setBio(null);
      setDisplayName(null);
      props.setPopped(false);
    });
  };

  const bio_onchange = (event) => {
    setBio(event.target.value);
  };

  const display_name_onchange = (event) => {
    setDisplayName(event.target.value);
  };

  const close = (event) => {
    if (event.target.classList.contains("profile_popup")) {
      props.setPopped(false);
    }
  };

  if (props.popped === true) {
    return (
      <div className="popup_form_wrap profile_popup" onClick={close}>
        <form className="profile_form popup_form" onSubmit={onsubmit}>
          <div className="popup_heading">
            <div className="popup_title">Edit Profile</div>
            <div className="submit">
              <button type="submit">Save</button>
            </div>
          </div>
          <div className="popup_content">
            <div className="upload" onClick={s3Uploadkey}>
              Upload Avatar
            </div>

            <input
              type="file"
              name="avatarUpload"
              onChange={s3Upload}
              accept="image/png, image/jpeg"
            />

            <div className="field display_name">
              <label>Display Name</label>
              <input
                type="text"
                placeholder="Display Name"
                value={displayName}
                onChange={display_name_onchange}
              />
            </div>
            <div className="field bio">
              <label>Bio</label>
              <textarea placeholder="Bio" value={bio} onChange={bio_onchange} />
            </div>
            <FormErrors errors={errors} />
          </div>
        </form>
      </div>
    );
  }
}

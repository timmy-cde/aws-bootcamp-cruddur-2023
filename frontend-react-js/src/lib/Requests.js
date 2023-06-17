import { getAccessToken } from "lib/CheckAuth";

async function request(method, url, payload_data, setErrors, success) {
  if (setErrors !== null) {
    setErrors("");
  }
  let res;
  try {
    await getAccessToken();
    const access_token = localStorage.getItem("access_token");
    const attrs = {
      method: method,
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    if (method !== "GET") {
      attrs.body = JSON.stringify(payload_data);
    }

    const res = await fetch(url, attrs);
    let data = await res.json();
    if (res.status === 200) {
      success(data);
    } else {
      if (setErrors !== null) {
        setErrors(data);
      }
      console.log(res);
    }
  } catch (err) {
    if (err instanceof Response) {
      console.log("HTTP error detected: ", err.status);
      if (setErrors !== null) {
        setErrors([`generic_${res.status}`]);
      }
    } else {
      if (setErrors !== null) {
        setErrors([`generic_500`]);
      }
    }

    console.log(err);
  }
}

export function post(url, payload_data, setErrors, success) {
  request("POST", url, payload_data, setErrors, success);
}

export function put(url, payload_data, setErrors, success) {
  request("PUT", url, payload_data, setErrors, success);
}

export function get(url, setErrors, success) {
  request("GET", url, null, setErrors, success);
}

export function destroy(url, payload_data, setErrors, success) {
  request("DELETE", url, payload_data, setErrors, success);
}

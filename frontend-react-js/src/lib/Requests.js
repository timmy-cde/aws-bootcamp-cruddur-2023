import { getMouseEventOptions } from "@testing-library/user-event/dist/utils";
import { getAccessToken } from "lib/CheckAuth";

async function request(method, url, payload_data, options) {
  if (options.hasOwnProperty('setErrors')) {
    options.setErrors("");
  }
  let res;
  try {
    const attrs = {
      method: method,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    };
    
    if (options.hasOwnProperty("auth") === true && options.auth === true) {
      await getAccessToken();
      const access_token = localStorage.getItem("access_token");
      attrs.headers["Authorization"] = `Bearer ${access_token}`;
    }
    
    if (method !== "GET") {
      attrs.body = JSON.stringify(payload_data);
    }

    const res = await fetch(url, attrs);
    let data = await res.json();
    if (res.status === 200) {
      options.success(data);
    } else {
      if (options.hasOwnProperty('setErrors')) {
        options.setErrors(data);
      }
      console.log(res);
    }
  } catch (err) {
    if (err instanceof Response) {
      console.log("HTTP error detected: ", err.status);
      if (options.hasOwnProperty('setErrors')) {
        options.setErrors([`generic_${res.status}`]);
      }
    } else {
      if (options.hasOwnProperty('setErrors')) {
        options.setErrors([`generic_500`]);
      }
    }

    console.log(err);
  }
}

export function post(url, payload_data, options) {
  request("POST", url, payload_data, options);
}

export function put(url, payload_data, options) {
  request("PUT", url, payload_data, options);
}

export function get(url, options) {
  request("GET", url, null, options);
}

export function destroy(url, payload_data, options) {
  request("DELETE", url, payload_data, options);
}

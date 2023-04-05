import { Auth } from "aws-amplify";
import checkAuth from "./CheckAuth";

const getIdToken = async (loadData, setUser) => {

    Auth.currentSession().then(res => {
        let accessToken = res.getAccessToken()

        localStorage.setItem(
            "access_token",
            accessToken.jwtToken
        );

        loadData();
        checkAuth(setUser);

    })
}

export default getIdToken;

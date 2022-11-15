import ls from "../util/localStorage";
import { Redirect } from "react-router-dom";

const Logout = ({ expiredToken }) => {
    ls.removeByKey("token");
    if (expiredToken) {
        console.log("Your session has expired");
        return <Redirect to="/login?message=expired" />
    }
    return <Redirect to="/login" />
}

export default Logout;
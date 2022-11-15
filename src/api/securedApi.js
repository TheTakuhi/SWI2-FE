import Axios from "axios";
import ls from "../util/localStorage";

const securedApi = Axios.create({
    baseURL: process.env.REACT_APP_BASE_SERVER_URL
})

securedApi.interceptors.request.use(config => {
    config.headers["Authorization"] = extractToken();
    return config;
})

export default securedApi;

function extractToken() {
    const token = ls.getByKey("token");
    return token ? `Bearer ${token}` : "";
}
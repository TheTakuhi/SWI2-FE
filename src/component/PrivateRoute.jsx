import { Redirect, Route } from "react-router-dom";
import ls from "../util/localStorage";

const PrivateRoute = ({ component: Component, ...rest }) => {

    const token = ls.getByKey("token");

    return (
        <Route
            {...rest}
            render={(props) => {
                if (!token) {
                    return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
                }
                return <Component {...props} />;
            }}
        />
    )
}

export default PrivateRoute;
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import Login from './component/Login';
import PrivateRoute from "./component/PrivateRoute";
import Navbar from './component/Navbar';
import ChatroomsPage from './page/ChatroomsPage';
import NotificationsHandler from "./component/Notifications/NotificationsHandler";
import UsersPage from "./page/UsersPage";

const App = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/login" component={Login} />
                <PrivateRoute path="/" component={() => (<>
                    <Navbar />
                    <Switch>
                        <Route path="/chatrooms" component={ChatroomsPage} />
                        <Route path="/users" component={UsersPage} />
                        <Route path="/*">
                            <Redirect to="/chatrooms" />
                        </Route>
                    </Switch>
                    <NotificationsHandler />
                </>)} />
            </Switch>
        </Router>
    );
}

export default App;
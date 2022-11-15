import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';

import { useUserDetailQuery } from "../hooks/user/queries/useUserDetailQuery";
import Logout from "../component/Logout";
import UsersList from "../component/UserList";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

const UserPage = () => {

    let { path } = useRouteMatch();
    const { data: user, isLoading, error } = useUserDetailQuery();

    if (isLoading) return <Spinner animation="border" />
    if (Boolean(error)) {
        console.log(error);

        if (error.response?.status === 403) {
            return <Logout expiredToken={true} />
        } else
            return <Alert variant="danger" dismissible>{error.message}</Alert>;
    }

    return (<>
        <Container fluid>
            <Row className="m-0 p-0 justify-content-center">
                <Switch>
                    <Route path={`${path}/search`}>
                        <Col className="mx-0 mb-sm-4 mb-md-0 p-0" xs={12}>
                            <UsersList userId={user.id} />
                        </Col>
                    </Route>
                    <Redirect to="/chatrooms" />
                </Switch>
            </Row>
        </Container>
    </>);
}

export default UserPage;
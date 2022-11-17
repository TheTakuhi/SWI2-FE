import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';

import ChatroomList from '../component/Chatroom/ChatroomList';
import ChatroomContainer from '../component/Chatroom/ChatroomContainer/ChatroomContainer';
import { Route, useRouteMatch } from "react-router-dom";
import { useUserDetailQuery } from "../hooks/user/queries/useUserDetailQuery";
import Logout from "../component/Logout";

const ChatroomsPage = () => {

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
                <Col className="mx-0 mb-sm-4 mb-md-0 p-0" xs={12} sm={8} md={5}>
                    <Route path={[`${path}/:chatroomId`, path]}>
                        <ChatroomList userId={user.id} />
                    </Route>
                </Col>

                <Route exact path={`${path}/:chatroomId`}>
                    <Col className="m-0 p-0" xs={12} sm={8} md={7} xl={6}>
                        <ChatroomContainer userId={user.id}/>
                    </Col>
                </Route>
            </Row>
        </Container>
    </>);
}

export default ChatroomsPage;
import { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Button, Alert } from 'react-bootstrap';
import {
    getAllChatroomsQueryKey,
    useAllChatroomIdsQuery
} from "../../hooks/chatroom/queries/useAllChatroomIdsQuery";
import Logout from "../Logout";
import { useParams } from "react-router";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useQueryClient } from "react-query";
import { getChatroomMessagesQueryKey } from "../../hooks/chatroom/queries/useChatroomMessagesQuery";
import UserShortcutBanner from "../UserShortcutBanner";

const ChatroomList = ({ userId }) => {

    let { chatroomId: chatroomIdFromParams } = useParams();
    const { data, isLoading, error } = useAllChatroomIdsQuery();
    const [chatroomId, setChatroomId] = useState(chatroomIdFromParams);
    const { push } = useHistory();
    const { url, params } = useRouteMatch();
    const queryClient = useQueryClient();

    const userIdEquals = (id) => Number(id) === Number(userId);
    const chatroomIdEquals = (id) => Number(id) === Number(chatroomId);

    const renderParticipants = (users) => {
        if (!users || !users.length) return "Chat room has no users";

        if (users.length === 2) {
            const attachedUser = users.filter(u => !userIdEquals(u.id))[0];
            return <UserShortcutBanner
                bg="dark"
                fontSize="1.4rem"
                username={attachedUser.username}
                animation={true}
            />
        } else {
            return users.filter(u => Number(u.id) !== Number(userId))
                .map(u => (<UserShortcutBanner
                    key={u.id}
                    bg="dark"
                    fontSize="1.4rem"
                    username={u.username}
                    animation={true}
                />))
        }
    }

    const renderChatRooms = () => {
        if (!data || !data.length)
            return <Row><h3>No chat rooms found</h3></Row>

        return data.map(chatroom => <Row className="m-0 p-0" key={chatroom.id}>
            <Col xs={12}>
                <div className="d-grid gap-2" style={{backgroundColor: "#90e0ef"}}>
                    <Button
                        variant={`${chatroomIdEquals(chatroom.id) ? 'warning' : 'secondary'}`}
                        className="m-1 position-relative"
                        style={{ textAlign: 'center', backgroundColor: "#0077b6" }}
                        onClick={() => {
                            queryClient.removeQueries(getAllChatroomsQueryKey());
                            queryClient.removeQueries(getChatroomMessagesQueryKey(chatroom.id));
                            push(chatroomIdEquals(chatroom.id) ? `/chatrooms` : `/chatrooms/${chatroom.id}`);
                            setChatroomId(Number(chatroomId) === chatroom.id ? undefined : chatroom.id);
                        }}
                    >
                        {renderParticipants(chatroom.users)}
                        {(Number(chatroom.newMessagesCount) && (!chatroomIdEquals(chatroom.id))) ? (
                            <span
                                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                {chatroom.newMessagesCount}
                                <span className="visually-hidden">unread messages</span>
                            </span>
                        ) : ""}
                    </Button>
                </div>
            </Col>
        </Row>);
    }

    useEffect(() => {
        setChatroomId(params.chatroomId);
        // eslint-disable-next-line
    }, [url])

    if (isLoading && !data) return <Spinner animation="border" />
    if (Boolean(error)) {
        console.log(error);
        if (error.response.status === 403)
            return <Logout expiredToken={true} />
        else
            return <Alert variant="error">{error.message}</Alert>
    }

    return (
        <Container fluid className="m-0 p-0">
            <Row className="mx-0 p-0">
                <h3>Your chat rooms:</h3>
            </Row>
            {renderChatRooms()}
        </Container>
    );
}

export default ChatroomList;
import { Container, Row, Col, Spinner, Alert, Card } from 'react-bootstrap';
import { useHistory, useLocation } from "react-router-dom";
import { useSearchUsersQuery } from "../hooks/user/queries/useSearchUsersQuery";
import Logout from "./Logout";
import UserShortcutBanner from "./UserShortcutBanner";
import useCreateChatroomCommand from "../hooks/chatroom/mutations/useCreateChatroomCommand";

const getFromQS = (name, location) => new URLSearchParams(location.search).get(name);

const UsersList = ({ userId }) => {
    const location = useLocation();
    const term = getFromQS("term", location);
    const { data: users, isLoading, error } = useSearchUsersQuery(term);
    const { mutate } = useCreateChatroomCommand();
    const { push } = useHistory();

    const handleUserClick = (id) => {
        const values = {
            attachedUserIds: [userId, id],
            title: "",
        }

        mutate(values, {
            onSuccess: (data) => {
                push(`/chatrooms/${data}`);
            },
            onError: (data) => console.log({ data }),
        });

    }

    const renderUsers = (values) => {
        if (!values || !values.length) return "No users found";

        return values
            .filter(u => Number(u.id) !== Number(userId))
            .map(u => (
                <Row key={u.id}>
                    <Col xs={12} md={6} className="mb-2">
                        <Card onClick={() => handleUserClick(u.id)} className="shadow" style={{ cursor: "pointer" }}>
                            <Card.Body>
                                <span className="me-3"><UserShortcutBanner username={u.username}
                                                                           bg="secondary" /></span>
                                <span className="h5">{u.username}</span>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            ));
    }

    if (isLoading && !users) return <Spinner animation="border" />
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
                <h3>Searched users by: <b>{term}</b></h3>
            </Row>
            {renderUsers(users)}
        </Container>
    );
}

export default UsersList;
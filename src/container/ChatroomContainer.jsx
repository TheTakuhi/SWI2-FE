import { Container, Row } from 'react-bootstrap';

import { useParams } from "react-router";
import ChatroomWindow from "../component/ChatroomWindow/ChatroomWindow";

const ChatroomContainer = ({ userId }) => {

    const { chatroomId } = useParams();

    if (!chatroomId)
        return <h4>Please select ChatRoom to show messages</h4>

    return (<>
        <Container fluid className="m-0 p-0">
            <Row className="mx-0 p-0">
                <h3>Chatroom with </h3>
            </Row>
            <ChatroomWindow userId={userId} />
        </Container>
    </>);

}
export default ChatroomContainer;
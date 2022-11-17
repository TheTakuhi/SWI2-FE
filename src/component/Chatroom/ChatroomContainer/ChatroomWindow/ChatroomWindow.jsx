import { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import SockJsClient from "react-stomp";
import dayjs from "dayjs";

import { getByKey } from "../../../../util/localStorage";
import { useChatroomMessagesQuery } from "../../../../hooks/chatroom/queries/useChatroomMessagesQuery";
import { useParams } from "react-router";
import ChatroomMessages from "./ChatroomMessages";
import Logout from "../../../Logout";
import ChatroomWindowForm from "./ChatroomWindowForm";

const createEndpoint = (chatroomId, userId) =>
    (chatroomId && userId) ? `/topic/user_${userId}/chatroom_${chatroomId}` : undefined;

const ChatroomWindow = ({ userId }) => {

    const { chatroomId } = useParams();
    const [messages, setMessages] = useState([]);
    const [wsEndpoint, setWsEndpoint] = useState(() => createEndpoint(chatroomId, userId));
    const [justWriting, setIfJustWriting] = useState([]);
    const [iAmWriting, setIfIAmWriting] = useState(false);

    let channelRef = useRef(null);

    let {
        isLoading: isLoadingMessages,
        error: errorMessages,
    } = useChatroomMessagesQuery(chatroomId, (msgs) => setMessages([...msgs]));

    const addMessage = (message) => {
        setMessages(prev => {
            const messageExists = prev.find(m => String(m.id) === String(message.id));
            if (!messageExists) return [...prev, message].sort((m1, m2) => {
                const date1 = dayjs(m1.createdAt);
                const date2 = dayjs(m2.createdAt);
                if (date1.isSame(date2)) return 0;
                if (date1.isBefore(date2)) return 1;
                return 0;
            });
            return [...prev];
        });
    }

    const isIdAlreadyWriting = (id) => justWriting.some(r => r.authorId === id);

    const handleWritingMessage = (message) => {
        if (message.type === 'JUST_WRITING') {
            const { authorId, authorUsername } = message;
            if (authorId === userId) {
                setIfIAmWriting(true);
                setTimeout(() => setIfIAmWriting(false), 4000);
            } else if (!isIdAlreadyWriting(authorId)) {
                setIfJustWriting(prev => [...prev, { authorId, authorUsername }]);
                setTimeout(() => setIfJustWriting(prev => prev.filter(r => r.authorId !== authorId)), 4000);
            }
        } else if (message.type === 'CANCELED_WRITING') {
            const { authorId } = message;
            if (authorId === userId) {
                setIfIAmWriting(false);
            } else {
                setIfJustWriting(prev => prev.filter(r => r.authorId !== authorId));
            }
        }
    }

    useEffect(() => {
        const endpoint = createEndpoint(chatroomId, userId);
        setWsEndpoint(endpoint);
    }, [chatroomId, userId])

    if (isLoadingMessages) return <Spinner animation="border" />
    if (Boolean(errorMessages)) {
        console.log(errorMessages);
        if (errorMessages.response.status === 403)
            return <Logout expiredToken={true} />
        else
            return (<Alert variant="danger">
                {errorMessages.message}
            </Alert>)
    }

    if (!chatroomId || !userId)
        return <Alert variant="warning">Please specify chatroomId and userId</Alert>

    return (<>
        <Container fluid>
            <SockJsClient
                url="http://localhost:8080/chat"
                headers={{
                    "Authorization": 'Bearer ' + getByKey('token'),
                }}
                subscribeHeaders={{
                    "chatroomId": chatroomId,
                }}
                topics={[wsEndpoint]}
                onConnect={() => {
                    console.log("Websocket client connected");
                    console.log("Subscribing chatroom " + wsEndpoint);
                }}
                onDisconnect={() => {
                    console.log("Unsubscribing chatroom " + wsEndpoint);
                    console.log("Websocket client disconnected")
                }}
                onMessage={message => {
                    if (!message.type) addMessage(message);
                    else handleWritingMessage(message);
                }}
                ref={(client) => channelRef = client}
            />
            <Row style={{ maxHeight: '75vh', overflowY: "scroll", overflowX: "hidden" }}>
                <ChatroomMessages messages={messages} justWriting={justWriting} />
            </Row>
            <Row>
                <Col md={12}>
                    <ChatroomWindowForm
                        chatroomId={chatroomId}
                        onSubmit={message => addMessage(message)}
                        onWriting={() => {
                            if (channelRef && !iAmWriting) {
                                channelRef.sendMessage(`/app/chatrooms/${chatroomId}/writing`, null);
                            }
                        }}
                        cancelWriting={() => {
                            if (channelRef && iAmWriting) {
                                channelRef.sendMessage(`/app/chatrooms/${chatroomId}/writing_canceled`, null);
                            }
                        }}
                    />
                </Col>
            </Row>
        </Container>
    </>);

}
export default ChatroomWindow;
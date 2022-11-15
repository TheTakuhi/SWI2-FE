import { Badge, Col, Row } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import TypeAnimation from 'react-type-animation';
import UserShortcutBanner from "../UserShortcutBanner";

const ChatroomMessages = ({ messages, justWriting }) => {

    const [writingUsers, setWritingUsers] = useState(justWriting);

    let lastMessage = useRef(null);

    const renderMyMessage = (message, index) => {
        return (
            <Col xs={12} md={8} key={index} className={"ms-auto"}>
                <Row className="m-0 p-0">
                    <Col xs={10} className="m-0 p-0 d-flex justify-content-end align-items-center">
                        <Badge style={{ overflowX: "hidden" }} bg="primary"
                               className="text-wrap fw-light text-start d-inline-block">{message.message}</Badge>
                    </Col>
                    <Col xs="auto" className="m-0 p-0">
                        <UserShortcutBanner username={message.senderUsername} bg="primary" fontSize="1rem"
                                            tooltip={true} />
                    </Col>
                </Row>
            </Col>
        );
    }

    const renderOtherMessage = (message, index) => {
        return (
            <Col xs={12} md={8} key={index}>
                <Row className="m-0 p-0">
                    <Col xs="auto" className="m-0 p-0">
                        <UserShortcutBanner username={message.senderUsername} bg="secondary" fontSize="1rem"
                                            tooltip={true} />
                    </Col>
                    <Col xs={10} className="m-0 p-0 d-flex align-items-center" style={{ overflowX: "hidden" }}>
                        <Badge bg="secondary"
                               className="text-wrap fw-light text-start d-inline-block">{message.message}</Badge>
                    </Col>
                </Row>
            </Col>
        );
    }

    useEffect(() => {
        setWritingUsers(justWriting);
    }, [justWriting])

    useEffect(() => {
            if (lastMessage.current !== null)
                lastMessage.scrollIntoView({ behavior: "smooth" });
        }
        , [messages])

    if (!messages || !messages.length) return <h4>No messages found</h4>;

    return (
        <>
            {messages.map((message, index) => {
                return (message.owned ?
                    renderMyMessage(message, index)
                    :
                    renderOtherMessage(message, index))
            })}
            {(writingUsers && writingUsers.length > 0) && (
                <Col xs={12} className="text-center">
                    {writingUsers.map(author => (
                        <span
                            key={author.authorId}
                            className="badge rounded-pill bg-secondary mr-2"
                        >{author.authorUsername} is writing
                        {/*<TypeAnimation*/}
                        {/*    cursor={false}*/}
                        {/*    repeat={Infinity}*/}
                        {/*    sequence={['...', 3000, '']}*/}
                        {/*    wrapper="span"*/}
                        {/*/>*/}
                    </span>
                    ))}
                </Col>
            )}
            <div ref={(end) => lastMessage = end} />
        </>
    );
}

export default ChatroomMessages;
import {Button, Col, Form, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import useCreateMessageCommand from "../../../../hooks/message/mutations/useCreateMessageCommand";
import InputEmoji from "react-input-emoji";

const ChatroomWindowForm = ({onSubmit, chatroomId, onWriting, cancelWriting}) => {

    const [message, setMessage] = useState("");
    const {mutate, error} = useCreateMessageCommand();
    const [writingTimeoutId, setWritingTimeoutId] = useState(undefined);

    const handleSubmit = (e) => {
        Boolean(e) && e.preventDefault();
        if (!Boolean(message)) return;

        const messageRequestDTO = {message, chatroomId};
        mutate(messageRequestDTO, {
            onSuccess: (data) => {
                onSubmit(data);
                setMessage("");
            },
            onError: (data) => console.log({data}),
        });
    }

    function handleWriting(message) {
        if (Boolean(message) && !Boolean(writingTimeoutId)) {
            onWriting && onWriting();
        } else if (!Boolean(message) && Boolean(writingTimeoutId)) {
            cancelWriting && cancelWriting();
            setWritingTimeoutId(undefined);
        }
    }

    useEffect(() => {
        handleWriting(message);
    }, [message])

    if (error) {
        console.log(error);
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} className="my-3" controlId="new-message">
                <Col xs={10} className="align-items-center">
                    <InputEmoji
                        value={message}
                        onEnter={() => handleSubmit()}
                        onChange={msg => setMessage(msg)}
                    />
                </Col>
                <Col xs={2} className="px-0 d-flex align-items-center">
                    <Button
                        type="submit"
                        variant="primary"
                        className="rounded-pill"
                        disabled={!Boolean(message)}
                    >
                        Send
                    </Button>
                </Col>
            </Form.Group>
        </Form>
    );
}

export default ChatroomWindowForm;
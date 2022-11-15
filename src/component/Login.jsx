import { useState } from 'react';
import { Form, Button, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import useAuthenticateCommand from "../hooks/auth/mutations/useAuthenticateCommand";
import ls from "../util/localStorage";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { push } = useHistory();

    const { mutate, error, isLoading } = useAuthenticateCommand();

    const location = useLocation();
    let expired = new URLSearchParams(location.search).get("message") === "expired";

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!Boolean(username) || !Boolean(password)) return;

        const credentials = { username, password };
        mutate(credentials, {
            onSuccess: (data) => {
                let token = data?.authorization;
                if (token) {
                    token = token.replace('Bearer ', '');
                    ls.setByKey("token", token);
                    push("/chatrooms");
                }
            },
            onError: (data) => console.log({ data }),
        });
    }

    return (<>
        {ls.getByKey("token") && <Redirect to="/chatrooms" />}
        <Container className="my-5">
            <Row>
                <Col sm={6}>
                    {error?.message && (
                        <Alert variant="danger">{error.message}</Alert>)}
                    {expired && (
                        <Alert
                            variant="danger"
                            onClose={() => push("/location")}
                            dismissible
                        >{"Your session has expired."}</Alert>)}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="username"
                                placeholder="Enter username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={isLoading}>
                            {isLoading ? <Spinner animation="border" /> : "Sign In"}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    </>);
}

export default Login;
import { useState } from 'react';
import {Form, Button, Container, Row, Col, Spinner, Alert, Image} from 'react-bootstrap';
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
        <Container style={{textAlign: "center"}}>
            <h1>Messenger 2.0 <Image src="logo128.png" style={{width: "2.5rem"}}/></h1>
            <h5 style={{fontStyle: "italic"}}>By Tomáš Dámek & Matouš Kiedroň</h5>
        </Container>


        {ls.getByKey("token") && <Redirect to="/chatrooms" />}
        <Container className="my-5" style={{backgroundColor: "#03045e"}}>
            <Row style={{justifyContent: "center"}}>
                <Col sm={6}>
                    {error?.message && (
                        <Alert variant="danger">{error.message}</Alert>)}
                    {expired && (
                        <Alert
                            variant="danger"
                            onClose={() => push("/location")}
                            dismissible
                        >{"Your session has expired."}</Alert>)}
                    <Form onSubmit={handleSubmit} style={{marginTop: "2vw"}}>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label style={{color: "#FFFFFF"}}>Username</Form.Label>
                            <Form.Control
                                type="username"
                                placeholder="Enter username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label style={{color: "#FFFFFF"}}>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={isLoading} style={{margin: "2vw 0 2vw", width: "100%"}}>
                            {isLoading ? <Spinner animation="border" /> : "Sign In"}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    </>);
}

export default Login;
import { Link, useHistory } from 'react-router-dom';
import { Navbar, Container, Nav, Form, FormControl, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

import { useUserDetailQuery } from "../hooks/user/queries/useUserDetailQuery";
import Logout from "./Logout";
import ls from "../util/localStorage";
import { useState } from "react";

const CustomNavbar = () => {

    const { data: user, error } = useUserDetailQuery();
    const { push } = useHistory();
    const [search, setSearch] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        if (!search) return;
        push(`/users/search?term=${search}`);
        setSearch("");
    }

    if (Boolean(error)) {
        console.log(error);
        if (error.response.status === 403)
            return <Logout expiredToken={true} />
    }

    return (<>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="mb-4">
            <Container>
                <Navbar.Brand href="/chatrooms">ChatCaffee</Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar" />
                <Navbar.Collapse id="main-navbar">
                    <Nav className="me-auto">
                        <Nav.Link href="/chatrooms">Chatrooms</Nav.Link>
                    </Nav>
                    <Navbar.Collapse className="justify-content-end">
                        <Form className="d-flex me-0 me-md-5" onSubmit={handleSearch}>
                            <FormControl
                                type="search"
                                placeholder="Search user"
                                className="me-2"
                                aria-label="Search"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <Button variant="outline-success" onClick={handleSearch}>Search</Button>
                        </Form>
                        <Navbar.Text className="d-block me-3">
                            Signed in as: <a href="#profile">{Boolean(user) ? user.username : "User"}</a>
                        </Navbar.Text>
                        <Button
                            variant="outline-secondary "
                            as={Link}
                            to="/login"
                            onClick={() => {
                                ls.removeByKey("token");
                                push("/login");
                            }}><FontAwesomeIcon icon={faSignOutAlt} /></Button>
                    </Navbar.Collapse>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </>);
}

export default CustomNavbar;
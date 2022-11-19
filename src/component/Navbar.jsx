import { Link, useHistory } from 'react-router-dom';
import {Navbar, Container, Nav, Form, FormControl, Button, Image} from 'react-bootstrap';
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

    return (
    <>
        <Navbar collapseOnSelect expand="lg" style={{backgroundColor: "#03045e"}} className="mb-4">
            <Container>
                <Navbar.Brand style={{color: "#FFFFFF"}} href="/chatrooms">Messenger 2.0 <Image src="logo128.png" style={{width: "1.5rem"}}/></Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar" />
                <Navbar.Collapse id="main-navbar">
                    <Nav className="me-auto">
                        <Nav.Link style={{color: "#FFFFFF", fontStyle: "italic", marginLeft: "1.5vw"}} href="/chatrooms">Chatrooms</Nav.Link>
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
                            <Button variant="success" onClick={handleSearch}>Search</Button>
                        </Form>
                        <Navbar.Text className="d-block me-3" style={{color: "#FFFFFF", marginLeft: "15vw"}}>
                            Profile: <a style={{color: "#90e0ef"}} href="#profile">{Boolean(user) ? user.username : "User"}</a>
                        </Navbar.Text>
                        <Button
                            variant="primary"
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
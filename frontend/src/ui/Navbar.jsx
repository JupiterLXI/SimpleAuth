import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

import { Navbar, Nav, NavDropdown, Button, Form, FormControl, Container } from 'react-bootstrap';


export default function MyNavbar() {
  const { user, logout } = useContext(AuthContext);

  return (
      <Navbar expand="md" variant="dark" bg="dark" className="w-100">
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className="fw-bold fst-italic text-warning">SimpleAuth</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarNav" />
          <Navbar.Collapse id="navbarNav">
            <Nav className="me-auto mb-2 mb-lg-0">
              <Nav.Link as={Link} to="/" className="fw-bolder">Home</Nav.Link>
            </Nav>
            <Form className="d-flex">
              <FormControl
                type="search"
                placeholder="Search..."
                className="me-2"
                aria-label="Search"
              />
            </Form>
            {user ? (
              <NavDropdown title={user.username} id="userDropdown" className="text-info" align="end">
                <NavDropdown.Item as={Link} to={`/auth/profile`} className='fw-semibold text-primary'>Profile</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to={`/auth/logout`} className='text-danger'>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <div className="d-flex">
                <Button as={Link} to="/auth/login" variant="outline-light" className="me-2">Login</Button>
                <Button as={Link} to="/auth/register" variant="outline-light">Sign Up</Button>
              </div>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
  );
}

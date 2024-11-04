// LoginPage.tsx
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage: React.FC = () => {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userID, password }),
    });

    if (response.ok) {
      console.log('Login successful');
    } else {
      console.log('Login failed');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <Col md={6} className="d-none d-md-flex align-items-center justify-content-center">
          <div className="login-image">
            <img src="https://via.placeholder.com/400" alt="Decorative" className="img-fluid" />
          </div>
        </Col>
        <Col md={6} xs={12} className="p-5 border">
          <h3 className="mb-4">Log in</h3>
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="formUserID">
              <Form.Label>Enter your ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter ID"
                value={userID}
                onChange={(e) => setUserID(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Enter password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Log in
            </Button>
          </Form>
          <div className="mt-3 text-center">
            <a href="/forgot-password">Forgot password?</a>
          </div>
          <div className="mt-3 text-center">
            Don't have an account? <a href="/signup">Create account</a>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;

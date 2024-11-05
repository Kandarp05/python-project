import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // Set body class on mount and cleanup on unmount
  useEffect(() => {
    document.body.classList.add('login-page');
    return () => {
      document.body.classList.remove('login-page');
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Reset error message on new attempt

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        console.log('Login successful');
        navigate('/home');
      } else {
        const errorData = await response.json().catch(() => null);
        setError(errorData?.detail || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Unable to reach the server. Please try again later.');
    }
  };

  return (
    <Container className="login-container">
      <div className="login-form">
        <h3 className="text-center mb-4">Log in</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="formUserID">
            <Form.Label>Enter your ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter ID"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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

          <Button variant="primary" type="submit" className="login-button">
            Log in
          </Button>
        </Form>
        <div className="mt-3 text-center">
          <a href="/forgot-password" className="login-link">Forgot password?</a>
        </div>
        <div className="mt-3 text-center footer">
          Don’t have an account? <a href="/signup" className="login-link">Create account</a>
        </div>
      </div>
    </Container>
  );
};

export default LoginPage;

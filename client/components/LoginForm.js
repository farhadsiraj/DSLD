import React, { useRef, useState } from 'react'
import { Button, Card, Form, Alert } from 'react-bootstrap'
import { useAuth } from '../components/contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import styled from 'styled-components'
import GlobalStyles from '../GlobalStyles'

export default function LoginForm() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const { login } = useAuth()
  const [error, setError] = useState('')
  // using this state to disable the login button
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      // set error to an empty string so we have no error
      setError('')
      setLoading(true)
      await login(emailRef.current.value, passwordRef.current.value)
      history.push('/dashboard')
    } catch (error) {
      setError('Failed to sign in')
    }
    setLoading(false)
  }

  return (
    <>
      <GlobalStyles />
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Log In</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Button
              disable={loading.toString()}
              type="submit"
              className="w-100 text-center mt-2"
            >
              Log In
            </Button>
          </Form>
          <div className="w-100 text=center mt-3">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text=center mt-2">
        Need an account? <Link to="/signup">Sign Up</Link>
      </div>
    </>
  )
}

import React, { useRef, useState } from 'react'
import { Button, Card, Form, Alert } from 'react-bootstrap'
import { useAuth } from './contexts/AuthContext'
import { Link } from 'react-router-dom'
import GlobalStyles from '../GlobalStyles'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function ForgotPassword() {
  const emailRef = useRef()
  const { resetPassword } = useAuth()
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  // using this state to disable the login button
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      // set error to an empty string so we have no error
      // set message to an empty string so we have no success message
      // to reset password, use tempmail website
      setMessage('')
      setError('')
      setLoading(true)
      await resetPassword(emailRef.current.value)
      setMessage('check your inbox for further instructions')
    } catch (error) {
      setError('Failed to reset password')
    }
    setLoading(false)
  }

  return (
    <>
      <GlobalStyles />
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Password Reset</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Button
              disable={loading.toString()}
              type="submit"
              className="w-100 text-center mt-2"
            >
              Reset Password
            </Button>
          </Form>
          <div className="w-100 text=center mt-3">
            <Link to="/login">Log In</Link>
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text=center mt-2">
        Need an account? <Link to="/signup">Sign Up</Link>
      </div>
    </>
  )
}

import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react'

import io from './services/ws'
import { DTOMessage, IFormState, IMessageState } from './types'

import Header from './components/Header'
import Footer from './components/Footer'

import { v4 } from 'uuid'

import { ToastContainer, toast } from 'react-toastify'
import { Button, Container, Form } from 'react-bootstrap'
import GlobalStyle, {
  Messages,
  Message as MessageContainer,
  Wrapper,
} from './style'

/**
 * App
 */
export default function App() {
  const [formData, setFormData] = useState<IFormState>({
    id: io.id,
    name: '',
    content: '',
  })
  const [messages, setMessages] = useState<Array<IMessageState>>([])
  const [connected, setConnected] = useState<boolean>(io.connected)

  const { id, name, content } = formData

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (name.length > 0 && content.length > 0) {
      io.emit('message', formData)

      setMessages([...messages, { id, name, content }])
      setFormData({ ...formData, content: '' })
    }
  }

  useEffect(() => {
    io.connect()

    io.on('connected', (message: string) => {
      toast.success(message, { className: 'bg-primary' })
    })
  }, [])

  useEffect(() => {
    setConnected(!connected)
  }, [io.connected])

  io.on('disconnected', (message: string) => {
    toast.success(message, { className: 'bg-primary' })
  })

  io.on('message', ({ name, content }: DTOMessage) => {
    setMessages([...messages, { id: v4().toString(), name, content }])
  })

  return (
    <>
      <Header />
      <Container className="py-3">
        <Wrapper className="shadow">
          <Messages className="shadow-sm">
            {messages.map(message => (
              <MessageContainer
                key={message.id + Math.random()}
                left={message.id !== id}
              >
                <p>
                  <strong>{message.name}</strong> {message.content}
                </p>
              </MessageContainer>
            ))}
          </Messages>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group>
              <Form.Control
                className="shadow-sm border-0"
                type="text"
                placeholder="Seu nome"
                required
                name="name"
                value={name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                className="shadow-sm border-0"
                type="text"
                placeholder="Mensagem"
                required
                name="content"
                value={content}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button
              variant="primary"
              className="shadow-sm m-auto"
              type="submit"
            >
              Enviar
            </Button>
          </Form>
        </Wrapper>
      </Container>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
      />
      <GlobalStyle />
    </>
  )
}

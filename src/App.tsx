import React, {
  ChangeEvent,
  FormEvent,
  ReactElement,
  useState,
  useEffect,
} from 'react'

import io from './services/ws'
import {
  FormStateProps,
  MessageStateProps,
  Message as MessageType,
} from './types'

import Header from './components/Header'
import Footer from './components/Footer'

import { v4 } from 'uuid'

import { Button, Container, Form } from 'react-bootstrap'
import GlobalStyle, { Messages, Message, Wrapper } from './style'

/**
 * App
 */
export default function App(): ReactElement {
  const [formData, setFormData] = useState<FormStateProps>({
    id: io.id,
    name: '',
    content: '',
  })
  const [messages, setMessages] = useState<MessageStateProps[]>([])

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
    io.emit('connected', `Estou conectado ao servidor: ${io.id}`)
  }, [])

  io.on('message', ({ name, content }: MessageType) => {
    setMessages([...messages, { id: v4().toString(), name, content }])
  })

  return (
    <>
      <Header />
      <Container className="py-3">
        <Wrapper className="shadow">
          <Messages className="shadow-sm">
            {messages.map(message => (
              <Message key={Math.random()} left={message.id !== id}>
                <p>
                  <strong>{message.name}</strong> {message.content}
                </p>
              </Message>
            ))}
          </Messages>
          <Form
            onSubmit={(event: FormEvent<HTMLFormElement>) =>
              handleFormSubmit(event)
            }
          >
            <Form.Group>
              <Form.Control
                className="shadow-sm border-0"
                type="text"
                placeholder="Seu nome"
                required
                name="name"
                value={name}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(event)
                }
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
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(event)
                }
              />
            </Form.Group>
            <Button variant="primary" className="shadow-sm" type="submit">
              Enviar
            </Button>
          </Form>
        </Wrapper>
      </Container>
      <Footer />
      <GlobalStyle />
    </>
  )
}

import React from 'react'

import { Container } from 'react-bootstrap'

/**
 * Footer
 */
const Footer = () => (
  <footer className="bg-transparent">
    <Container className="py-3 text-center">
      <p className="text-primary">
        Gabriel Frontório - Victor B. Fiamoncini &copy; -{' '}
        <strong>{new Date().getFullYear()}</strong>
      </p>
    </Container>
  </footer>
)

export default Footer

import { Container, Row, Col } from 'react-bootstrap'

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row>
          <Col className='text-center pt-5 pb-3'>
            MERN-boilerplate &copy; Srđan Kljajević
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer

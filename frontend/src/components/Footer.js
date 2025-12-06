import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';

export default function Footer () {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={4}>
            <h5>About Us</h5>
            <p>
              Your trusted source for water purification solutions in Tunisia.
            </p>
          </Col>

          <Col md={4}>
            <h5>Contact</h5>
            <p>
              <i className="fas fa-phone me-2" /> (+216)94874295<br />
              <i className="fas fa-envelope me-2" /> admin@skftechnologies.com
            </p>
          </Col>

          <Col md={4}>
            <h5>Follow Us</h5>
            <div className="social-icons">
              <a
                href="https://www.facebook.com/Kent.Tunisia"
                className="me-3 text-light"
              >
                <i className="fab fa-facebook" />
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

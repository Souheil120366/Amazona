import React from 'react';
import {Card, Placeholder, Col} from 'react-bootstrap';

export default function ProductSkeleton () {
  return (
    <Col>
      <Card className="product-card h-100 shadow-sm mb-3">
        <div
          className="product-image-container"
          style={{backgroundColor: '#e9ecef'}}
        >
          <Placeholder
            as={Card.Img}
            animation="glow"
            className="product-image"
          />
        </div>
        <Card.Body>
          {/* Product title skeleton */}
          <Placeholder as={Card.Title} animation="glow">
            <Placeholder xs={8} bg="secondary" />
          </Placeholder>

          {/* Price skeleton */}
          <Placeholder as={Card.Text} animation="glow">
            <Placeholder xs={4} bg="secondary" />
          </Placeholder>

          {/* Rating skeleton */}
          <Placeholder as={Card.Text} animation="glow">
            <Placeholder xs={6} bg="secondary" />
          </Placeholder>

          {/* Button skeleton */}
          <Placeholder.Button variant="primary" xs={12} />
        </Card.Body>
      </Card>
    </Col>
  );
}

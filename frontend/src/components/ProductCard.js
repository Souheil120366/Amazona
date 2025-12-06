// frontend/src/components/ProductCard.js
import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import {Link} from 'react-router-dom';
import Rating from './Rating';

export default function ProductCard({product, onAddToCart}) {
  return (
    <Card className="product-card h-100">
      <div className="product-image-container">
        <Link to={`/product/${product.slug}`}>
          <Card.Img
            variant="top"
            src={product.image}
            className="product-image"
          />
        </Link>
        {product.countInStock === 0 &&
          <div className="out-of-stock-overlay">
            <span>Out of Stock</span>
          </div>}
      </div>

      <Card.Body className="d-flex flex-column">
        <Link to={`/product/${product.slug}`} className="text-decoration-none">
          <Card.Title className="product-title">
            {product.name}
          </Card.Title>
        </Link>

        <div className="mb-2">
          <Rating rating={product.rating} numReviews={product.numReviews} />
        </div>

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center">
            <span className="product-price">{product.price} TND</span>
            {product.countInStock > 0 &&
              <Button
                onClick={() => onAddToCart (product)}
                variant="primary"
                className="add-to-cart-btn"
              >
                <i className="fas fa-cart-plus" />
              </Button>}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

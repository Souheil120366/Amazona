import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useContext, useEffect, useReducer } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Rating from '../components/Rating';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { Store } from '../Store';
import Form from 'react-bootstrap/Form';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductScreen() {
  const requestUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  
  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });
  
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const fetchData = async () => {
    dispatch({ type: 'FETCH_REQUEST' });
    try {
      const result = await axios.get(
        requestUrl + `/api/products/slug/${slug}`
      );
      dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
    } catch (err) {
      dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
    }
  };

  useEffect(() => {
    fetchData();
  }, [slug]);

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(
      requestUrl + `/api/products/${product._id}`
    );
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
    navigate('/cart');
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!rating) {
      toast.error('Please select a rating');
      return;
    }
    try {
      await axios.post(
        `${requestUrl}/api/products/${product._id}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      toast.success('Review submitted successfully');
      fetchData();
      setRating(0);
      setComment('');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div className="container">
      <Row className="mb-4">
        <Col md={3}>
          <img
            className="img-large"
            src={product.image}
            alt={product.name}
          />
        </Col>
        <Col md={6}>
          <div className="product-detail-card">
            <Helmet>
              <title>{product.name}</title>
            </Helmet>
            <h1 className="product-title">{product.name}</h1>
            <Rating
              rating={product.rating}
              numReviews={product.numReviews}
              caption={product.numReviews === 1 ? 'one review' : ` ${product.numReviews} reviews`}
            />
            <div className="product-price">Price: {product.price} TND</div>
            <div className="product-description">
              <h4>Description:</h4>
              <p>{product.description}</p>
            </div>
          </div>
        </Col>
        <Col md={3}>
          <Card className="product-detail-card">
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col className="text-end">{product.price} TND</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col className="text-end">
                      {product.countInStock > 0 ? (
                        <Badge bg="success">In Stock</Badge>
                      ) : (
                        <Badge bg="danger">Unavailable</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={addToCartHandler} variant="primary" size="lg">
                        Add to Cart
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="reviews-section">
        <h2>Customer Reviews</h2>
        {product.reviews && product.reviews.length === 0 ? (
          <MessageBox>There are no reviews yet</MessageBox>
        ) : (
          <ListGroup variant="flush">
            {product.reviews &&
              product.reviews.map((review) => (
                <ListGroup.Item key={review._id} className="review-item">
                  <div className="review-header">
                    <span className="review-author">{review.name}</span>
                    <span className="review-date">{review.createdAt.substring(0, 10)}</span>
                  </div>
                  <Rating rating={review.rating} caption=" " />
                  <p className="review-comment">{review.comment}</p>
                </ListGroup.Item>
              ))}
          </ListGroup>
        )}

        <div className="review-form">
          {userInfo ? (
            <form onSubmit={submitHandler}>
              <h3>Write a Review</h3>
              <Form.Group className="mb-3" controlId="rating">
                <Form.Label>Rating</Form.Label>
                <Form.Select
                  aria-label="Rating"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="form-select"
                >
                  <option value="">Select...</option>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very good</option>
                  <option value="5">5 - Excellent</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="comment">
                <Form.Label>Your Review</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about the product..."
                />
              </Form.Group>
              <div className="mb-3">
                <Button type="submit" variant="primary" size="lg">
                  Submit Review
                </Button>
              </div>
            </form>
          ) : (
            <MessageBox>
              Please{' '}
              <Link to={`/signin?redirect=/product/${product.slug}`}>
                Sign In
              </Link>{' '}
              to write a review
            </MessageBox>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductScreen;

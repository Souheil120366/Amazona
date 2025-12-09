import React from 'react';
import {useContext} from 'react';
import {Store} from '../Store';
import {Helmet} from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MessageBox from '../components/MessageBox';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {toast} from 'react-toastify';

export default function CartScreen () {
  //const requestUrl = "https://www.skftechnologies.com:5000";
  const requestUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate ();
  const {state, dispatch: ctxDispatch} = useContext (Store);
  const {cart: {cartItems}} = state;
  const updateCartHandler = async (item, quantity) => {
    if (!state.userInfo) {
      toast.error ('Please sign in to modify the cart');
      navigate ('/signin');
      return;
    }
    const {data} = await axios.get (requestUrl + `/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert ('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch ({
      type: 'CART_ADD_ITEM',
      payload: {...item, quantity},
    });
  };
  const removeItemHandler = item => {
    ctxDispatch ({type: 'CART_REMOVE_ITEM', payload: item});
  };

  const checkoutHandler = () => {
    navigate ('/signin?redirect=/shipping');
  };
  return (
    <div className="position-relative">

      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0
            ? <MessageBox>
                Cart is empty. <Link to="/">Go Shopping</Link>
              </MessageBox>
            : <ListGroup>
                {cartItems.map (item => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={4}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        />
                        {' '}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>

                        <Button
                          onClick={() =>
                            updateCartHandler (item, item.quantity - 1)}
                          variant="light"
                          disabled={item.quantity === 1}
                        >
                          <i className="fas fa-minus-circle" />
                        </Button>{' '}
                        <span>{item.quantity}</span>{' '}

                        <Button
                          variant="light"
                          onClick={() =>
                            updateCartHandler (item, item.quantity + 1)}
                          disabled={item.quantity === item.countInStock}
                        >

                          <i className="fas fa-plus-circle" />
                        </Button>
                      </Col>
                      <Col md={3}>{item.price} TND</Col>
                      <Col md={2}>

                        <Button
                          onClick={() => removeItemHandler (item)}
                          variant="light"
                        >
                          <i className="fas fa-trash" />
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>

                  {cartItems.reduce ((a, c) => a + c.quantity, 0) > 1
                    ? <h4>
                        {' '}
                        Subtotal (
                        {cartItems.reduce ((a, c) => a + c.quantity, 0)}
                        {' '}
                        items) :{' '}

                        {cartItems.reduce (
                          (a, c) => a + c.price * c.quantity,
                          0
                        )}
                        {' '}
                        TND
                      </h4>
                    : <h4>
                        {' '}
                        Subtotal (
                        {cartItems.reduce ((a, c) => a + c.quantity, 0)}
                        {' '}
                        item) :{' '}

                        {cartItems.reduce (
                          (a, c) => a + c.price * c.quantity,
                          0
                        )}
                        {' '}
                        TND
                      </h4>}
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={checkoutHandler}
                      disabled={cartItems.length === 0}
                    >
                      Passer ma commande
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

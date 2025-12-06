import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import {Link} from 'react-router-dom';
import Rating from './Rating';
import React from 'react';
import axios from 'axios';
import {useContext} from 'react';
import {Store} from '../Store';

function Product (props) {
  //const requestUrl = "http://www.skftechnologies.com:5000";
  const requestUrl = '';
  const {product} = props;

  const {state, dispatch: ctxDispatch} = useContext (Store);
  const {cart: {cartItems}} = state;

  const addToCartHandler = async item => {
    const existItem = cartItems.find (x => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
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
  return (
    <Card>
      <div className="product-image-container">
        <Link to={`/product/${product.slug}`}>
          <img
            src={product.image}
            className="card-img-top product-image"
            alt={product.name}
          />
        </Link>
      </div>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>{product.price} TND</Card.Text>

        {product.countInStock === 0
          ? <Button variant="light" disabled>
              Out of stock
            </Button>
          : <Button onClick={() => addToCartHandler (product)}>
              Add to cart
            </Button>}
      </Card.Body>
    </Card>
  );
}

export default Product;

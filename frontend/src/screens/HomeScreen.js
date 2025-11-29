import React, {useState, useEffect, useReducer, useContext} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../components/Product';
import axios from 'axios';
import logger from 'use-reducer-logger';
import {Helmet} from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import ProductSkeleton from '../components/ProductSkeleton';
import ProductCard from '../components/ProductCard';
import { toast } from 'react-hot-toast';
import { Store } from '../Store';
//import dotenv from 'dotenv';
//import Carousel from 'react-bootstrap/Carousel';
//import Container from 'react-bootstrap/Container';
import Slide from '../slide.js';

//dotenv.config();

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return {...state, loading: true};
    case 'FETCH_SUCCESS':
      return {...state, products: action.payload, loading: false};
    case 'FETCH_FAIL':
      return {...state, loading: false, error: action.payload};
    default:
      return state;
  }
};

function getWindowDimensions () {
  const {innerWidth: width, innerHeight: height} = window;
  return {
    width,
    height,
  };
}

function useWindowDimensions () {
  const [windowDimensions, setWindowDimensions] = useState (
    getWindowDimensions ()
  );

  useEffect (() => {
    function handleResize () {
      setWindowDimensions (getWindowDimensions ());
    }

    window.addEventListener ('resize', handleResize);
    return () => window.removeEventListener ('resize', handleResize);
  }, []);

  return windowDimensions;
}

function HomeScreen () {
  const requestUrl = process.env.REACT_APP_API_URL || '';
  const {state, dispatch: ctxDispatch} = useContext(Store);
  const {cart: {cartItems}} = state;
  const [{loading, error, products}, dispatch] = useReducer (logger (reducer), {
    products: [],
    loading: true,
    error: '',
  });

  const {height, width} = useWindowDimensions ();

  // Create array of skeletons
  const loadingSkeletons = Array.from({ length: 8 }).map((_, index) => (
    <ProductSkeleton key={index} />
  ));

  useEffect (() => {
    const fetchData = async () => {
      dispatch ({type: 'FETCH_REQUEST'});
      try {
        const result = await axios.get (requestUrl + '/api/products');
        dispatch ({type: 'FETCH_SUCCESS', payload: result.data});
      } catch (err) {
        dispatch ({type: 'FETCH_FAIL', payload: err.message});
        toast.error('Failed to load products');
      }
    };
    fetchData ();
  }, [requestUrl]);

  const addToCartHandler = async (product) => {
    try {
      const existItem = cartItems.find((x) => x._id === product._id);
      const quantity = existItem ? existItem.quantity + 1 : 1;
      const { data } = await axios.get(`${requestUrl}/api/products/${product._id}`);
      
      if (data.countInStock < quantity) {
        toast.error('Sorry. Product is out of stock');
        return;
      }
      
      ctxDispatch({
        type: 'CART_ADD_ITEM',
        payload: { ...product, quantity },
      });
      
      toast.success('Added to cart');
    } catch (error) {
      toast.error('Error adding product to cart');
    }
  };

  return (
    <div>
      <Helmet>
        <title>S K F Osmoseur</title>
      </Helmet>
      {/*<Slide />*/}

      <h1 className="text-5xl pb-4 font-bold text-blue-400">Featured Products</h1>

      <div className="products">
        {loading
          ? <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {loadingSkeletons}
            </Row>
          : error
              ? <MessageBox variant="danger">{error}</MessageBox>
              : <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                  {products.map((product) => (
                    <Col key={product._id}>
                      <ProductCard 
                        product={product} 
                        onAddToCart={addToCartHandler}
                      />
                    </Col>
                  ))}
                </Row>}
      </div>

    </div>
  );
}
export default HomeScreen;

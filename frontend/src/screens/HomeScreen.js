import React from 'react';
import {useState, useEffect, useReducer} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../components/Product';
import axios from 'axios';
import logger from 'use-reducer-logger';
import {Helmet} from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
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
  //const requestUrl = 'https://www.skftechnologies.com:5000';
  const requestUrl = process.env.REACT_APP_API_URL;
  const [{loading, error, products}, dispatch] = useReducer (logger (reducer), {
    products: [],
    loading: true,
    error: '',
  });

  const {height, width} = useWindowDimensions ();

  useEffect (() => {
    const fetchData = async () => {
      dispatch ({type: 'FETCH_REQUEST'});
      try {
        const result = await axios.get (requestUrl + '/api/products');
        dispatch ({type: 'FETCH_SUCCESS', payload: result.data});
      } catch (err) {
        dispatch ({type: 'FETCH_FAIL', payload: err.message});
      }
    };
    fetchData ();
  }, []);

  return (
    <div>
      <Helmet>
        <title>S K F Osmoseur</title>
      </Helmet>
      {/*<Slide />*/}

      <h1 className="text-5xl pb-4 font-bold text-blue-400">Featured Products</h1>

      <div className="products">
        {loading
          ? <LoadingBox />
          : error
              ? <MessageBox variant="danger">{error}</MessageBox>
              : <Row>
                  {products.map (product => (
                    <Col
                      key={product.slug}
                      xs={6}
                      sm={6}
                      md={3}
                      lg={3}
                      className="mb-3"
                    >
                      <Product product={product} />
                    </Col>
                  ))}
                </Row>}
      </div>

    </div>
  );
}
export default HomeScreen;

import React from 'react';
import Axios from 'axios';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {Helmet} from 'react-helmet-async';
import {useContext, useEffect, useState} from 'react';
import {Store} from '../Store';
import {toast} from 'react-toastify';
import {getError} from '../utils';
import CryptoJS from 'crypto-js';

export default function SigninScreen () {
  //const requestUrl = "https://www.skftechnologies.com:5000";
  const requestUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate ();
  const {search} = useLocation ();
  const redirectInUrl = new URLSearchParams (search).get ('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';
  const [email, setEmail] = useState ('');
  const [password, setPassword] = useState ('');

  const {state, dispatch: ctxDispatch} = useContext (Store);
  const {userInfo} = state;
  const submitHandler = async e => {
    e.preventDefault ();
    try {
      // Hash password on client side using deterministic SHA256
      const hashedPassword = CryptoJS.SHA256 (password).toString ();

      const {data} = await Axios.post (requestUrl + '/api/users/signin', {
        email,
        password: hashedPassword,
      });
      ctxDispatch ({type: 'USER_SIGNIN', payload: data});
      localStorage.setItem ('userInfo', JSON.stringify (data));
      navigate (redirect || '/');
    } catch (err) {
      toast.error (getError (err));
    }
  };

  useEffect (
    () => {
      if (userInfo) {
        navigate (redirect);
      }
    },
    [navigate, redirect, userInfo]
  );

  return (
    <Container className="small-container">
      <br />
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <h1 className="my-3">Sign In</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>

          <Form.Control
            type="email"
            required
            onChange={e => setEmail (e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>

          <Form.Control
            type="password"
            required
            onChange={e => setPassword (e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Sign In</Button>
        </div>
        <div className="mb-3">
          New customer?{' '}
          <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
        </div>
      </Form>
    </Container>
  );
}

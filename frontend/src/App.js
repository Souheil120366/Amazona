import React from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CartScreen from './screens/CartScreens';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import SigninScreen from './screens/SigninScreen';


function App() {
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  return (
    <BrowserRouter>
    <div className="grid-container">
    <header className="row">
      <div>
          
          <Link className="brand" to="/">
            SKF Technologies
          </Link>
      </div>
      <div>
          <Link to="/cart">
              Cart
              {cartItems.length > 0 && (
                <span className="badge">{cartItems.length}</span>
              )}
            </Link>
          <Link to="/signin">Sign In</Link>
      </div>
    </header>
    <main>
      <Routes>
        <Route path='/cart/:id' element={<CartScreen />}></Route>
        <Route path="/product/:id" element={<ProductScreen />}></Route>
        <Route path="/signin" element={<SigninScreen />}></Route>
        <Route path="/" element={< HomeScreen />} ></Route>
      </Routes>
      
    </main>
    <footer className='row center'>
      All rights reserved @2022 
    </footer>

  </div>
  </BrowserRouter>
  );
}

export default App;

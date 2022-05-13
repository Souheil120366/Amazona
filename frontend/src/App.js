import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CartScreen from './screens/CartScreens';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';


function App() {
  return (
    <BrowserRouter>
    <div className="grid-container">
    <header className="row">
      <div>
          <a className="brand" href="index.html">S K F Technologies</a>
      </div>
      <div>
          <a href="signin.html">Sign-In</a>
          <a href="cart.html">Cart</a>
      </div>
    </header>
    <main>
      <Routes>
        <Route path='/cart/:id' element={<CartScreen />}></Route>
        <Route path="/product/:id" element={<ProductScreen />}></Route>
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

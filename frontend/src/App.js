import React from 'react';
import {Link, BrowserRouter, Route, Routes} from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {LinkContainer} from 'react-router-bootstrap';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import {useContext, useEffect, useState} from 'react';
import {Store} from './Store';
import {useSessionTimeout} from './hooks/useSessionTimeout';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignupScreen from './screens/SignupScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from 'react-bootstrap/Button';
import {getError} from './utils';
import axios from 'axios';
import SearchBox from './components/SearchBox';
import SearchScreen from './screens/SearchScreen';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardScreen from './screens/DashboardScreen';
import AdminRoute from './components/AdminRoute';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import MapScreen from './screens/MapScreen';
import {Card, Placeholder, Col} from 'react-bootstrap';
import ProductSkeleton from './components/ProductSkeleton';
import Row from 'react-bootstrap/Row';
import ProductCard from './components/ProductCard';
import Footer from './components/Footer';

function App () {
  //const requestUrl = 'https://www.skftechnologies.com:5000';
  const requestUrl = '';
  const {state, dispatch: ctxDispatch} = useContext (Store);

  const {fullBox, cart, userInfo} = state;

  // Activate session timeout (5 minutes of inactivity)
  useSessionTimeout (5);

  const signoutHandler = () => {
    ctxDispatch ({type: 'USER_SIGNOUT'});
    localStorage.removeItem ('userInfo');
    localStorage.removeItem ('cartItems');
    localStorage.removeItem ('shippingAddress');
    localStorage.removeItem ('paymentMethod');
    window.location.href = '/signin';
  };

  const [sidebarIsOpen, setSidebarIsOpen] = useState (false);
  const [categories, setCategories] = useState ([]);

  useEffect (() => {
    const fetchCategories = async () => {
      try {
        const {data} = await axios.get (
          requestUrl + `/api/products/categories`
        );
        setCategories (data);
      } catch (err) {
        toast.error (getError (err));
      }
    };
    fetchCategories ();
  }, []);

  const showSuccess = message => {
    toast.success (message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      style: {
        background: '#4caf50',
        color: 'white',
      },
    });
  };

  return (
    <BrowserRouter>
      <div>
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar
            className="navbar-dark variant-dark expand-sm fixed-top navbar-bg-image"
            style={{
              background: 'linear-gradient(to right, #1a1a1a, #333)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <Container fluid>
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="justify-content-right w-100">
                  <div className="row ms-auto w-100 mr-auto">
                    <div className="col-12 mr-auto">
                      <Button
                        variant="dark"
                        onClick={() => setSidebarIsOpen (!sidebarIsOpen)}
                      >
                        <i className="fas fa-bars" />
                      </Button>
                      <LinkContainer to="/">
                        <Navbar.Brand className="ms-2">S K F</Navbar.Brand>
                      </LinkContainer>
                      <Navbar.Text className="ms-auto me-auto navbar-text-brand-color ">
                        OSMOSEURS TUNISIE
                      </Navbar.Text>
                      <Navbar.Text className="justify-content-end navbar-text-phone-color ">
                        <i class="fa fa-fw fa-phone" /> (+216)94874295
                      </Navbar.Text>
                    </div>
                    <div className="col-12 mr-auto">
                      <SearchBox />
                      <Link to="/cart" className="nav-link cart-color">
                        <i
                          class="fa fa-shopping-cart fa-2x"
                          aria-hidden="true"
                        />

                        {cart.cartItems.length > 0 &&
                          <Badge pill bg="danger">
                            {cart.cartItems.reduce (
                              (a, c) => a + c.quantity,
                              0
                            )}
                          </Badge>}
                      </Link>
                      {userInfo
                        ? <NavDropdown
                            title={userInfo.name}
                            id="basic-nav-dropdown"
                          >
                            <LinkContainer to="/profile">
                              <NavDropdown.Item>User Profile</NavDropdown.Item>
                            </LinkContainer>
                            <LinkContainer to="/orderhistory">
                              <NavDropdown.Item>Order History</NavDropdown.Item>
                            </LinkContainer>
                            <NavDropdown.Divider />
                            <Link
                              className="dropdown-item"
                              to="#signout"
                              onClick={signoutHandler}
                            >
                              Sign Out
                            </Link>
                          </NavDropdown>
                        : <Link className="nav-link" to="/signin">
                            Sign In
                          </Link>}
                      {userInfo &&
                        userInfo.isAdmin &&
                        <NavDropdown
                          title="Admin"
                          id="admin-nav-dropdown"
                          className="mr-3"
                        >
                          <LinkContainer to="/admin/dashboard">
                            <NavDropdown.Item>Dashboard</NavDropdown.Item>
                          </LinkContainer>
                          <LinkContainer to="/admin/products">
                            <NavDropdown.Item>Products</NavDropdown.Item>
                          </LinkContainer>
                          <LinkContainer to="/admin/orders">
                            <NavDropdown.Item>Orders</NavDropdown.Item>
                          </LinkContainer>
                          <LinkContainer to="/admin/users">
                            <NavDropdown.Item>Users</NavDropdown.Item>
                          </LinkContainer>
                        </NavDropdown>}
                    </div>
                  </div>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>

        <main>
          <Container fluid>

            <div
              className={
                sidebarIsOpen
                  ? 'box overlay'
                  : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
              }
            >
              <Nav className="flex-column text-white w-100 p-2">
                <Nav.Item>
                  <strong>Categories</strong>
                </Nav.Item>
                {categories.map (category => (
                  <Nav.Item key={category}>
                    <LinkContainer
                      to={{
                        //`/search?category=${category}`
                        pathname: '/search',
                        search: `?category=${encodeURIComponent (category)}`,
                      }}
                      onClick={() => setSidebarIsOpen (false)}
                    >
                      <Nav.Link>{category}</Nav.Link>
                    </LinkContainer>
                  </Nav.Item>
                ))}
              </Nav>
            </div>
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="/orderhistory" element={<OrderHistoryScreen />} />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ProductListScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoute>
                    <ProductEditScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderListScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserListScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/user/:id"
                element={
                  <AdminRoute>
                    <UserEditScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/map"
                element={
                  <ProtectedRoute>
                    <MapScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </Container>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

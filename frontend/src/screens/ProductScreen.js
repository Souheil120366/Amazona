import React, { useEffect } from 'react';
import Rating from '../components/Rating';

import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import MessageBox from '../components/MessageBox';
import LoadingBox from '../components/LoadingBox';
import { detailsProduct } from '../actions/productActions';

export default function ProductScreen({match}) {
  const dispatch = useDispatch();
  const {id} = useParams();
  const productId = id;
  const productDetails = useSelector(state => state.productDetails);
  const {loading,error,product} = productDetails; 
 
  useEffect(() => {
      dispatch(detailsProduct(productId));
  },[dispatch, productId]);

  return (
    <div>
    {loading? <LoadingBox></LoadingBox>
    :error?<MessageBox variant="danger">{error}</MessageBox>
    : (
        <div>  
        <Link to='/'>Back to Result</Link>   
       <div className='row top'>
           <div className='col-2'>
              <img className="large" src={product.image} alt={product.name}></img>
           </div>
           <div className='col-1'>
             <ul>
                 <li>
                     <h1>{product.name}</h1>
                 </li>
                 <li>
                     <Rating
                       rating={product.rating}
                       numReviews={product.numReviews}
                      ></Rating> 
                 </li>
                 <li>
                    Price:  {product.price} TND
                 </li>
                 <li>
                     Description: 
                     <p>{product.description}</p>
                 </li>
             </ul>
           </div>
           <div className='col-1'>
               <div className='card card-body'>
                   <ul>
                       <li>
                           <div className='row'>
                               <div>Price</div>
                               <div >{product.price} TND</div>
                            </div>
                       </li> 
                       <li>
                           <div className='row'>       
                               <div>Status </div>
                               <div>{product.countInStock > 0? 
                               <span className='success'>In Stock</span>
                               :<span className='error'>Unavailable</span>} 
                              </div>
                           </div>
                       </li>
                       <li>
                           <button className='primary block'>Add to cart</button>
                       </li>
                   </ul>
               </div>
           </div>
       </div>
       </div>
    )} 
  
 </div>
    
  )
}

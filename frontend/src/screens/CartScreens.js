import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

export default function CartScreen(props) {
  const {id} = useParams();
  const productId = id;
  const [searchParams] = useSearchParams();
  const qty = searchParams.get('qty');
    
  
   return (
        <div>
          <h1>Cart Screen</h1>
          <p>
            ADD TO CART : ProductID: {productId} Qty: {qty}
          </p>
        </div>
      );
    }
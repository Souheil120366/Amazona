import bcrypt from 'bcryptjs';


const data = {
    users: [
        {
          name: 'Souheil',
          email: 'khalfallah.souheil@gmail.com',
          password: bcrypt.hashSync('1234', 8),
          isAdmin: true,
        },
        {
          name: 'Iyadh',
          email: 'user@example.com',
          password: bcrypt.hashSync('1234', 8),
          isAdmin: false,
        },
      ],
    products: [
        {
            
            name: 'Full Zip Running Shirts',
            category: 'shirts',
            image: '/images/product-1.jpg',
            price: 60,
            brand: 'adidas',
            rating: 5,
            numReviews: 10,
            description: 'good product',
            countInStock: 0,
        },
        {
           
            name: 'Nike Zip Running Shirts',
            category: 'shirts',
            image: '/images/product-2.jpg',
            price: 50,
            brand: 'Nike',
            rating: 4.5,
            numReviews: 10,
            description: 'good product',
            countInStock: 6,
        },
        {
            
            name: 'Adidas Zip Running Shirts',
            category: 'shirts',
            image: '/images/product-3.jpg',
            price: 65,
            brand: 'Nike',
            rating: 3.4,
            numReviews: 10,
            description: 'good product',
            countInStock: 0,
        },
        {
           
            name: 'Channel Zip Running Shirts',
            category: 'shirts',
            image: '/images/product-1.jpg',
            price: 68,
            brand: 'Nike',
            rating: 3.5,
            numReviews: 12,
            description: 'good product',
            countInStock: 10,
        },
        {
           
            name: 'Fuck Zip Running Shirts',
            category: 'shirts',
            image: '/images/product-5.jpg',
            price: 56,
            brand: 'Nike',
            rating: 3.5,
            numReviews: 10,
            description: 'good product',
            countInStock: 16,
        },
        {
            
            name: 'Hello Zip Running Shirts',
            category: 'shirts',
            image: '/images/product-6.jpg',
            price: 76,
            brand: 'Nike',
            rating: 5,
            numReviews: 10,
            description: 'good product',
            countInStock: 6,
        },
    ],
};

export default data;
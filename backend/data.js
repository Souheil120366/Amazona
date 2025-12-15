import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Souheil',
      email: 'khalfallah.souheil@gmail.com',
      phone: 94874295,
      // Double-hash: hash the password, then hash it again (simulating client + server hashing)
      password: bcrypt.hashSync (bcrypt.hashSync ('12345', 10), 8),
      passwordVersion: 2,
      isAdmin: true,
    },
    {
      name: 'Iyadh',
      email: 'iyadh@example.com',
      phone: 92455453,
      // Double-hash: hash the password, then hash it again (simulating client + server hashing)
      password: bcrypt.hashSync (bcrypt.hashSync ('123456', 10), 8),
      passwordVersion: 2,
      isAdmin: false,
    },
  ],
  products: [
    {
      // _id: '1',
      name: 'Nike Slim shirt',
      slug: 'nike-slim-shirt',
      category: 'Shirts',
      image: '/images/p1.jpg', // 679px × 829px
      price: 120,
      countInStock: 3,
      brand: 'Nike',
      rating: 3.5,
      numReviews: 10,
      description: 'high quality shirt',
    },
    {
      // _id: '2',
      name: 'Adidas Fit Shirt',
      slug: 'adidas-fit-shirt',
      category: 'Shirts',
      image: '/images/p2.jpg',
      price: 250,
      countInStock: 0,
      brand: 'Adidas',
      rating: 5.0,
      numReviews: 10,
      description: 'high quality product',
    },
    {
      // _id: '3',
      name: 'Nike Slim Pant',
      slug: 'nike-slim-pant',
      category: 'Pants',
      image: '/images/p3.jpg',
      price: 25,
      countInStock: 15,
      brand: 'Nike',
      rating: 4.5,
      numReviews: 14,
      description: 'high quality product',
    },
    {
      // _id: '4',
      name: 'Adidas Fit Pant',
      slug: 'adidas-fit-pant',
      category: 'Pants',
      image: '/images/p4.jpg',
      price: 65,
      countInStock: 5,
      brand: 'Puma',
      rating: 4.5,
      numReviews: 10,
      description: 'high quality product',
    },
  ],
};
export default data;

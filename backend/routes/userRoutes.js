import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import {isAuth, isAdmin, generateToken} from '../utils.js';

const userRouter = express.Router ();

userRouter.get (
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler (async (req, res) => {
    const users = await User.find ({});
    res.send (users);
  })
);

userRouter.post (
  '/signin',
  expressAsyncHandler (async (req, res) => {
    const user = await User.findOne ({email: req.body.email});
    if (user) {
      const incoming = req.body.password || '';
      
      console.log('Signin attempt:', {
        email: req.body.email,
        incomingLength: incoming.length,
        storedPasswordLength: user.password.length,
      });

      // Simple comparison: client sends bcrypt hash, we stored bcrypt hash
      // Just compare them as strings since bcrypt hashes from same input will be identical
      const passwordMatch = incoming === user.password;
      
      console.log('Password comparison result:', passwordMatch);

      if (passwordMatch) {
        res.send ({
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          isAdmin: user.isAdmin,
          token: generateToken (user),
        });
        return;
      }
    }
    res.status (401).send ({message: 'Invalid email or password'});
  })
);
userRouter.post (
  '/signup',
  expressAsyncHandler (async (req, res) => {
    // Client sends pre-hashed password (SHA256 hash from frontend)
    // Store it directly 
    const incoming = req.body.password || '';
    
    console.log('Signup:', {
      email: req.body.email,
      incomingLength: incoming.length,
      isSHA256: incoming.length === 64, // SHA256 produces 64-char hex strings
    });
    
    const newUser = new User ({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: incoming,  // Store the client-hashed password directly
      passwordVersion: 2,
    });
    const user = await newUser.save ();
    res.send ({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      token: generateToken (user),
    });
  })
);

userRouter.put (
  '/profile',
  isAuth,
  expressAsyncHandler (async (req, res) => {
    const user = await User.findById (req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      // Client sends pre-hashed password, store it directly
      if (req.body.password) {
        user.password = req.body.password;  // Store client hash directly
        user.passwordVersion = 2;
      }

      const updatedUser = await user.save ();
      res.send ({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        isAdmin: updatedUser.isAdmin,
        token: generateToken (updatedUser),
      });
    } else {
      res.status (404).send ({message: 'User not found'});
    }
  })
);

userRouter.get (
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler (async (req, res) => {
    const user = await User.findById (req.params.id);
    if (user) {
      res.send (user);
    } else {
      res.status (404).send ({message: 'User Not Found'});
    }
  })
);

userRouter.put (
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler (async (req, res) => {
    const user = await User.findById (req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.isAdmin = Boolean (req.body.isAdmin);
      const updatedUser = await user.save ();
      res.send ({message: 'User Updated', user: updatedUser});
    } else {
      res.status (404).send ({message: 'User Not Found'});
    }
  })
);

userRouter.delete (
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler (async (req, res) => {
    const user = await User.findById (req.params.id);
    if (user) {
      if (user.email === 'admin@example.com') {
        res.status (400).send ({message: 'Can Not Delete Admin User'});
        return;
      }
      await user.remove ();
      res.send ({message: 'User Deleted'});
    } else {
      res.status (404).send ({message: 'User Not Found'});
    }
  })
);

// Admin-only: migrate existing users to double-hashed passwords (idempotent)
userRouter.post(
  '/migrate-passwords',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    let updated = 0;
    for (const user of users) {
      const version = user.passwordVersion ?? 1;
      if (version < 2) {
        // user.password currently holds single-hash; double-hash it
        user.password = bcrypt.hashSync(user.password, 8);
        user.passwordVersion = 2;
        await user.save();
        updated += 1;
      }
    }
    res.send({ message: 'Password migration complete', updated });
  })
);

export default userRouter;

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
      
      // Check if incoming password is a bcrypt hash (starts with $2a$, $2b$, or $2y$)
      const isClientHash = incoming.startsWith('$2a$') || incoming.startsWith('$2b$') || incoming.startsWith('$2y$');

      let passwordMatch = false;

      if (isClientHash) {
        // Client sent a bcrypt hash (new client-side hashing enabled)
        // Compare directly with stored password (which should be double-hashed)
        passwordMatch = bcrypt.compareSync (incoming, user.password);
      } else {
        // Client sent plain password (legacy or fallback)
        // Try comparing directly (works for single-hash stored passwords)
        passwordMatch = bcrypt.compareSync (incoming, user.password);
      }

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
    // Client sends pre-hashed password, hash it again on server (double-hash)
    const newUser = new User ({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: bcrypt.hashSync (req.body.password, 8),
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
      // Client sends pre-hashed password, hash it again on server (double-hash)
      if (req.body.password) {
        user.password = bcrypt.hashSync (req.body.password, 8);
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

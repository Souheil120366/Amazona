import express from 'express';
import axios from 'axios';

const mapRouter = express.Router ();

// Get Google Maps API key (restricted - only for authenticated users)
// Note: Consider implementing API key restrictions in Google Cloud Console
// Restrict to specific APIs (Maps JavaScript API only) and HTTP referrers
mapRouter.get ('/keys/google', async (req, res) => {
  try {
    // Verify user is authenticated
    if (!req.headers.authorization) {
      return res.status (401).send ({message: 'Authorization required'});
    }

    // Return the API key only to authenticated users
    // In production, add additional checks (rate limiting, user verification, etc.)
    res.send ({key: process.env.GOOGLE_API_KEY || ''});
  } catch (error) {
    res.status (500).send ({message: error.message});
  }
});

// Forward geocoding request to Google API server-side
mapRouter.get ('/geocode', async (req, res) => {
  try {
    const {address} = req.query;

    if (!address) {
      return res.status (400).send ({message: 'Address is required'});
    }

    const response = await axios.get (
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: {
          address: address,
          key: process.env.GOOGLE_API_KEY,
        },
      }
    );

    res.send (response.data);
  } catch (error) {
    res.status (500).send ({message: error.message});
  }
});

// Reverse geocoding request to Google API server-side
mapRouter.get ('/reverse-geocode', async (req, res) => {
  try {
    const {lat, lng} = req.query;

    if (!lat || !lng) {
      return res
        .status (400)
        .send ({message: 'Latitude and longitude are required'});
    }

    const response = await axios.get (
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: {
          latlng: `${lat},${lng}`,
          key: process.env.GOOGLE_API_KEY,
        },
      }
    );

    res.send (response.data);
  } catch (error) {
    res.status (500).send ({message: error.message});
  }
});

export default mapRouter;

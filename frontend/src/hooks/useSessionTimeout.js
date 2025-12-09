import {useContext, useEffect, useRef} from 'react';
import {Store} from '../Store';

/**
 * useSessionTimeout Hook
 * Logs out user after a period of inactivity (default: 15 minutes = 900000ms)
 * Activity events: mousemove, keypress, click, touchstart, scroll
 * Resets timer on each activity.
 */
export function useSessionTimeout (timeoutMinutes = 15) {
  const {state, dispatch} = useContext (Store);
  const {userInfo} = state;

  const timeoutRef = useRef (null);
  const timeoutMs = timeoutMinutes * 60 * 1000;

  const resetTimer = () => {
    // Only reset if user is logged in
    if (!userInfo) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout (timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout (() => {
      // Logout user
      dispatch ({type: 'USER_SIGNOUT'});
      localStorage.removeItem ('userInfo');
      localStorage.removeItem ('cartItems');
      localStorage.removeItem ('shippingAddress');
      localStorage.removeItem ('paymentMethod');
      window.location.href = '/';
    }, timeoutMs);
  };

  useEffect (
    () => {
      if (!userInfo) {
        // Clear timer if user logs out
        if (timeoutRef.current) {
          clearTimeout (timeoutRef.current);
        }
        return;
      }

      // Set up activity listeners
      const events = ['mousemove', 'keypress', 'click', 'touchstart', 'scroll'];

      events.forEach (event => {
        window.addEventListener (event, resetTimer);
      });

      // Initialize timer on mount
      resetTimer ();

      // Cleanup
      return () => {
        events.forEach (event => {
          window.removeEventListener (event, resetTimer);
        });
        if (timeoutRef.current) {
          clearTimeout (timeoutRef.current);
        }
      };
    },
    [userInfo, timeoutMs]
  );
}

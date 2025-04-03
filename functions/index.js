/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const functions = require('firebase-functions');
const stripe = require('stripe')('sk_test_51R9HekP2ektVprqCI1kR5cY33x2fkZqBepnyfFYckxwQF3sGJ4MiVKqyrmUUtOmcBu8gJB1x3y5ekTK6kNyCGQlg007nAV5w92'); // Replace with your secret key

// Firebase function to create Stripe Checkout session
exports.createCheckoutSession = functions.https.onRequest(async (req, res) => {
  const { amount, type } = req.body; // Retrieve donation/subscribe details

  try {
    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: type === 'donate' ? 'Donation' : 'Premium Subscription',
              description: type === 'donate' ? 'Support our app' : 'Monthly subscription for premium features',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment', // Use 'subscription' for recurring payments
      success_url: 'https://yourdomain.com/success',
      cancel_url: 'https://yourdomain.com/cancel',
    });

    res.json({ id: session.id }); // Send back the session ID to client
  } catch (error) {
    res.status(500).send(error); // Handle errors
  }
});


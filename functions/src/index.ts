import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';

admin.initializeApp();
const db = admin.firestore();

// Initialize CORS middleware
const corsHandler = cors({origin: true});

export const getExpenses = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      const expensesSnapshot = await db.collection('expenses').get();
      const expenses = expensesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      res.status(200).json(expenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      res.status(500).send('Error retrieving expenses');
    }
  });
});

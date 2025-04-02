import { db, auth, doc, getDoc, updateDoc, Timestamp } from './firebaseConfig.js';

const messageLimit = 10;  // Maximum number of messages per day for non-premium users

async function checkMessageLimit(userId) {
    try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            console.error('User not found');
            return false; // Handle user not found case
        }

        const userData = userDoc.data();
        const currentDate = new Date().toDateString(); // Get the current date as a string (e.g., "Mon Apr 01 2025")
        const lastResetDate = userData.lastResetTimestamp?.toDate().toDateString() || null;
        
        // Check if the day has changed
        if (lastResetDate !== currentDate) {
            // Reset the message count for the new day
            await updateDoc(userRef, {
                messagesSentToday: 0,
                lastResetTimestamp: Timestamp.fromDate(new Date())
            });
        }

        if (userData.premiumAccount || userData.messagesSentToday < messageLimit) {
            // Allow the message to be sent
            return true;
        } else {
            // Deny the message
            return false;
        }
    } catch (error) {
        console.error('Error checking message limit:', error);
        return false;
    }
}

export { checkMessageLimit };
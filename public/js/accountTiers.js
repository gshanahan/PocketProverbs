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
            alert('You have reached your daily message limit. Please upgrade to a premium account to send more messages.');
            return false;
        }
    } catch (error) {
        console.error('Error checking message limit:', error);
        return false;
    }
}

// Call this function when the user attempts to send a message
async function handleSendMessage(userId, messageContent) {
    const canSend = await checkMessageLimit(userId);
    if (canSend) {
        // Logic to send the message and update the user's message count
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            messagesSentToday: firebase.firestore.FieldValue.increment(1)
        });

        // Send the message (e.g., add to the "messages" collection in Firestore)
        // Example:
        // await addDoc(collection(db, 'messages'), {
        //     userId,
        //     messageContent,
        //     timestamp: Timestamp.now()
        // });
    }
}

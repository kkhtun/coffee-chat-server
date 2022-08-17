const firebaseAdminSdk = require("firebase-admin");
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);

try {
    firebaseAdminSdk.initializeApp({
        credential: firebaseAdminSdk.credential.cert(serviceAccount),
    });
} catch (e) {
    console.log(e.message);
}

module.exports = ({}) => ({
    verifyToken: (token) => firebaseAdminSdk.auth().verifyIdToken(token),
});

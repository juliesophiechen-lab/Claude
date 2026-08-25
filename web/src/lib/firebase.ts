import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDoqRGTaNztx1j_Cf1kQU1ROwqA5duJ664',
  authDomain: 'trip-seoul.firebaseapp.com',
  projectId: 'trip-seoul',
  storageBucket: 'trip-seoul.firebasestorage.app',
  messagingSenderId: '208330562070',
  appId: '1:208330562070:web:e66b86b422a0a2e33a7337',
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)

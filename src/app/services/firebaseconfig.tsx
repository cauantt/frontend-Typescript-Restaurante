// lib/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

// Sua configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAYZ-GXWY9UKsa8slkRSDcWcAg0YBSWsB8",
  authDomain: "teste-d4080.firebaseapp.com",
  projectId: "teste-d4080",
  storageBucket: "teste-d4080.appspot.com",
  messagingSenderId: "355223529386",
  appId: "1:355223529386:web:5bd15d024afa3fa19badd3",
  measurementId: "G-7P21YX5EFF"
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage, ref, getDownloadURL };

import './App.scss';
import Content from './components/content/content';
import NavBar from './components/navbar/navbar';
import SideBar from './components/sidebar/sidebar';

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { useState } from 'react';


initializeApp({
  apiKey: "AIzaSyCDZTLgld2lnDQfqwfWekAu-kq3uXEYKAk",
  authDomain: "church-backend-dbf84.firebaseapp.com",
  projectId: "church-backend-dbf84",
  storageBucket: "church-backend-dbf84.appspot.com",
  messagingSenderId: "538646634207",
  appId: "1:538646634207:web:e6d2b622a427e27be1d36a",
  measurementId: "G-65LDJQ1TCK"
});

export const firestore = getFirestore();

function App() {
  const [selected, setSelected] = useState("death");

  const select = (item) => setSelected(() => item)


  return (
    <div id="app">
      <NavBar />
      <main>
        <SideBar selected={selected} select={select} />
        <Content />
      </main>
    </div>
  );
}

export default App;

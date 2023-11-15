import React, { useEffect, useState } from "react";
import "./firebaseConfig"; // Add this line prevent firebase not loading error
import {
  getFirestore,
  addDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { getDocs } from "firebase/firestore";

function App() {
  const [inputValue1, setInputValue1] = useState("");
  const [inputValue2, setInputValue2] = useState("");
  let [storedValues, setStoredValues] = useState([]);

  const db = getFirestore();

  const saveDataToFirestore = async () => {
    const docRef = await addDoc(collection(db, "myCollection"), {
      field1: inputValue1,
      field2: inputValue2,
    });
    alert("Document written to Database");
  };

  const fetchDataFromFirestore = () => {
    const query = collection(db, "EspData");

    const unsubscribe = onSnapshot(query, (querySnapshot) => {
      const temporaryArr = [];
      querySnapshot.forEach((doc) => {
        temporaryArr.push(doc.data());
      });
      console.log(temporaryArr);
      setStoredValues(temporaryArr);
    });

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = fetchDataFromFirestore();
    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <h1>Data from Firestore</h1>
      {storedValues.map((value) => (
        <div>
          <div>Temperature: {value.Temperature}</div>
          <div>Humidity: {value.Humidity}</div>
          <div>Light: {value.Light}</div>
          <div>Rain: {value.Rain}</div>
        </div>
      ))}
    </div>
  );
}

export default App;

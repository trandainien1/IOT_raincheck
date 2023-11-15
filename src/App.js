import React, { useState } from "react";
import "./firebaseConfig"; // Add this line prevent firebase not loading error
import { getFirestore, addDoc, collection } from "firebase/firestore";
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

  const fetchDataFromFirestore = async () => {
    const querySnapshot = await getDocs(collection(db, "EspData"));
    const temporaryArr = [];
    querySnapshot.forEach((doc) => {
      temporaryArr.push(doc.data());
    });
    console.log(temporaryArr);
    setStoredValues(temporaryArr);
  };

  return (
    <div className="App">
      <h1>Save Data to Firebase Firestore</h1>
      <input
        type="text"
        value={inputValue1}
        onChange={(e) => setInputValue1(e.target.value)}
      />
      <input
        type="text"
        value={inputValue2}
        onChange={(e) => setInputValue2(e.target.value)}
      />
      <button onClick={saveDataToFirestore}>Save to Firestore</button>

      <button onClick={fetchDataFromFirestore}>Fetch from Firestore</button>

      <h2>Stored Values</h2>
      <ul>
        {storedValues.map((value, index) => (
          <li key={index}>
            Humidity: {value.Humidity}, Temperature: {value.Temperature}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

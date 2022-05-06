import React, { useEffect } from "react";
import Web3 from "web3";

import logo from "./logo.svg";
import "./App.css";

function App() {
  useEffect(() => {
    loadBlockchainData();
  }, []);
  const loadBlockchainData = async () => {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const network = await web3.eth.net.getNetworkType();
    console.log(" network ", network);
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello world</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button> connect </button>
      </header>
    </div>
  );
}

export default App;

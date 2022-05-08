import React, { useEffect , useState} from "react";
import Web3 from "web3";

import logo from "./logo.svg";
import "./App.css";

const App = () => {

  const [account, setAccount] = useState('');
  
  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    // const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const web3 = new Web3( "http://localhost:8545");
    const network = await web3.eth.net.getNetworkType();
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0])
    console.log(" network ", network);
    console.log(" account ", accounts);
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
        <p>Your account: { account}</p>
        <button onClick={()=> loadBlockchainData()}> connect </button>
      </header>
    </div>
  );
}

export default App;
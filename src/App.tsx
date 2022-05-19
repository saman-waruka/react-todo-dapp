import { useState } from "react";
import { initTodolistContract } from "./helper/contract";
import "./App.css";
import { Contract } from 'web3-eth-contract' ;
import {
  useQuery,
  gql,
} from "@apollo/client";
import TasksManagement from './components/TasksManagement';




declare global {
  interface Window {
      ethereum: any;
  }
}



const App = () => {

  const [account, setAccount] = useState("");
  const [network, setNetwork] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [todoListContract, setTodoListContract] = useState(undefined as unknown as Contract);
  const [isConnectedWallet, setIsConnectedWallet] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const resetState = () => {
    setAccount("");
    setNetwork("");
    setContractAddress("");
    setTodoListContract(undefined as unknown as Contract);
    setIsConnectedWallet(false);
    setIsConnecting(false);
  };

  window.ethereum.on("accountsChanged", (accounts : string[]) => {
    console.log("account changed ", accounts);
    resetState();
  });

  window.ethereum.on("chainChanged", (networkId: string) => {
    console.log(" networkId ", networkId);
    resetState();
  });



  const connectWallet = async () => {
    setIsConnecting(true);
    console.log("connectWallet  ");
    const { network, account, todoList, contractAddress } =
      await initTodolistContract();
    setContractAddress(contractAddress);
    setNetwork(network);
    setAccount(account);
    setTodoListContract(todoList);
    setIsConnectedWallet(true);
    setIsConnecting(false);
  };


  return (
    <div className="App">
      <div className="App-header">
        {!isConnectedWallet && (
          <button
            onClick={() => {
              connectWallet();
            }}
          >
            Connect Wallet
          </button>
        )}
        {isConnecting && <div>Connecting Wallet ...</div>}
        <p>Your network: {network}</p>
        <p>Your account: {account}</p>
        <p>Contract Address: {contractAddress}</p>
        { account &&<TasksManagement account={account} contract={todoListContract} isConnectedWallet={isConnectedWallet}/> }
        
      </div>
    </div>
  );
};

export default App;

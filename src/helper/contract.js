import { NETWORK } from "../constant/Network";
import { TODO_LIST_ABI, TODO_LIST_ADDRESS } from "../constant/TodoList";
import Web3 from "web3";

export const getContractAddress = (network) => {
  let contractAddress;
  switch (network) {
    case NETWORK.PRIVATE: {
      contractAddress = TODO_LIST_ADDRESS.PRIVATE;
      break;
    }

    case NETWORK.RINKEBY: {
      contractAddress = TODO_LIST_ADDRESS.RINKEBY;
      break;
    }

    default: {
      contractAddress = TODO_LIST_ADDRESS.PRIVATE;
      break;
    }
  }
  return contractAddress;
};

export const initTodolistContract = async () => {
  const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
  const network = await web3.eth.net.getNetworkType();
  const accounts = await web3.eth.getAccounts();
  const contractAddress = getContractAddress(network);
  const todoList = new web3.eth.Contract(TODO_LIST_ABI, contractAddress);
  return { todoList, network, accounts };
};

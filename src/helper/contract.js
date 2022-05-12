import Web3 from "web3";
import { NETWORK } from "../constants/Network";
import ganacheAddress from "../constants/address/ganache.json";
import rinkebyAddress from "../constants/address/rinkeby.json";
import todoListAbi from "../constants/abi/TodoList.json";

export const getContractAddress = (network) => {
  let contractAddress;
  switch (network) {
    case NETWORK.PRIVATE: {
      contractAddress = ganacheAddress.todoContract;
      break;
    }

    case NETWORK.RINKEBY: {
      contractAddress = rinkebyAddress.todoContract;
      break;
    }

    default: {
      contractAddress = ganacheAddress.todoContract;
      break;
    }
  }
  return contractAddress;
};

export const initTodolistContract = async () => {
  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
  const network = await web3.eth.net.getNetworkType();
  const accounts = await web3.eth.getAccounts();
  const contractAddress = getContractAddress(network);
  const todoList = new web3.eth.Contract(todoListAbi, contractAddress);
  return { todoList, network, account: accounts[0], contractAddress };
};

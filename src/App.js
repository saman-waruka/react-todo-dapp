import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { TODO_LIST_ABI, TODO_LIST_ADDRESS } from "./constant/TodoList";
import "./App.css";

const App = () => {
  const [account, setAccount] = useState("");
  const [network, setNetwork] = useState("");
  const [tasks, setTasks] = useState([]);
  const [taskCount, setTaskCount] = useState(0);
  const [todoListContract, setTodoListContract] = useState();
  const [loading, setLoading] = useState(false);
  console.log("tasks ", tasks);

  useEffect(() => {
    loadBlockchainData();
  }, []);

  window.ethereum.on("accountsChanged", function (accounts) {
    // Time to reload your interface with accounts[0]!
    console.log("account changed ", accounts);
    loadBlockchainData();
  });

  window.ethereum.on("networkChanged", function (networkId) {
    // Time to reload your interface with the new networkId
    console.log("network  changed ", networkId);
    loadBlockchainData();
  });

  const createTask = (content) => {
    setLoading(true);
    todoListContract.methods
      .createTask(content)
      .send({ from: account })
      .once("receipt", (receipt) => {
        console.log(" receipt ", receipt);
        setLoading(false);
        const newTask = receipt.events.TaskCreated.returnValues;
        setTasks([...tasks, newTask]);
        setTaskCount(Number(taskCount) + 1);
        // loadBlockchainData();
      });
  };

  const toggleTaskComplete = (id) => {
    setLoading(true);
    todoListContract.methods
      .toggleTaskComplete(id)
      .send({ from: account })
      .once("receipt", (receipt) => {
        console.log(" receipt ", receipt);
        setLoading(false);
      });
  };

  const loadBlockchainData = async () => {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const network = await web3.eth.net.getNetworkType();

    const accounts = await web3.eth.getAccounts();

    const todoList = new web3.eth.Contract(TODO_LIST_ABI, TODO_LIST_ADDRESS);

    const taskCount = await todoList.methods.taskCount().call();

    const allTask = [];
    for (let i = 1; i <= taskCount; i++) {
      const thisTask = await todoList.methods.tasks(i).call();
      // console.log("thisTask ", thisTask);
      allTask.push(thisTask);
    }
    console.log("loadBlockchainData  ");
    setNetwork(network);
    setAccount(accounts[0]);
    setTodoListContract(todoList);
    setTaskCount(taskCount);
    setTasks(allTask);
  };
  return (
    <div className="App">
      <header className="App-header">
        <p>Hello world</p>
        <p>Your network: {network}</p>
        <p>Your account: {account}</p>
        <p>Task Count: {taskCount}</p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            console.log("Event", event.target[0].value);
            createTask(event.target[0].value);
          }}
        >
          <input type="text" placeholder="Add task..." required />
          <input type="submit" value="Submit" />
        </form>
        {loading && <div>Loading...</div>}
        {tasks.map((task, key) => {
          return (
            <div key={key}>
              <label>
                <input
                  type="checkbox"
                  onChange={() => {
                    toggleTaskComplete(task.id);
                  }}
                  checked={task.completed}
                />
                <span>{task.id} .) </span>
                <span>{task.content}</span>
              </label>
            </div>
          );
        })}
      </header>
    </div>
  );
};

export default App;

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

  const createTask = (content) => {
    setLoading(true);
    todoListContract.methods
      .createTask(content)
      .send({ from: account })
      .once("receipt", (receipt) => {
        console.log(" receipt ", receipt);
        setLoading(false);
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
    setNetwork(network);
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);

    const todoList = new web3.eth.Contract(TODO_LIST_ABI, TODO_LIST_ADDRESS);
    setTodoListContract(todoList);
    const taskCount = await todoList.methods.taskCount().call();
    setTaskCount(taskCount);
    const allTask = [];
    for (let i = 1; i <= taskCount; i++) {
      const thisTask = await todoList.methods.tasks(i).call();
      console.log("thisTask ", thisTask);
      allTask.push(thisTask);
    }
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

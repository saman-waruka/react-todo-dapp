import React, { useEffect, useState } from "react";
import { initTodolistContract } from "./helper/contract";
import "./App.css";

const App = () => {
  const [account, setAccount] = useState("");
  const [network, setNetwork] = useState("");
  const [tasks, setTasks] = useState([]);
  const [taskCount, setTaskCount] = useState(0);
  const [todoListContract, setTodoListContract] = useState();
  const [loading, setLoading] = useState(false);

  console.log(" tasks ", tasks);
  useEffect(() => {
    loadBlockchainData();
  }, []);

  window.ethereum.on("accountsChanged", (accounts) => {
    console.log("account changed ", accounts);
    loadBlockchainData();
  });

  window.ethereum.on("chainChanged", (networkId) => {
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
      });
  };

  const toggleTaskComplete = (id) => {
    setLoading(true);
    todoListContract.methods
      .toggleTaskComplete(id)
      .send({ from: account })
      .once("receipt", (receipt) => {
        console.log(" receipt ", receipt);
        const foundIndex = tasks.findIndex((task) => task.id === id);
        tasks[foundIndex].completed = receipt.events.TaskCompleted.completed;
        setTasks(tasks);
        setLoading(false);
      });
  };

  const loadBlockchainData = async () => {
    const { network, accounts, todoList } = await initTodolistContract();
    const taskCount = await todoList.methods.taskCount().call();
    const allTask = [];
    for (let i = 1; i <= taskCount; i++) {
      const thisTask = await todoList.methods.tasks(i).call();
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
      <div className="App-header">
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
                  name={task.id}
                  onClick={() => {
                    toggleTaskComplete(task.id);
                  }}
                  defaultChecked={task.completed}
                />
                <span>{task.id} .) </span>
                <span>{task.content}</span>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;

import React, { useEffect, useState } from "react";
import { initTodolistContract } from "./helper/contract";
import "./App.css";

const App = () => {
  const [account, setAccount] = useState("");
  const [network, setNetwork] = useState("");
  const [contractAddress, setContractAddress] = useState("");
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
    console.log(" networkId ", networkId);
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
      })
      .once("error", (error) => {
        console.log("Error ocure", error);
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
        const foundIndex = tasks.findIndex((task) => task.id === id);
        tasks[foundIndex].completed = receipt.events.TaskCompleted.completed;
        setTasks(tasks);
        setLoading(false);
      })
      .once("error", (error) => {
        console.log("Error ocure", error);
        setLoading(false);

        alert(
          `error code: ${error.code} \nMessage: ${error.message} \n\nStack: ${error.stack}`
        );
      });
  };

  const loadBlockchainData = async () => {
    console.log("loadBlockchainData  ");
    const { network, account, todoList, contractAddress } =
      await initTodolistContract();
    const taskCount = await todoList.methods
      .getTaskCount()
      .call({ from: account });
    const allTask = await todoList.methods.getTasks().call({ from: account });

    setContractAddress(contractAddress);
    setNetwork(network);
    setAccount(account);
    setTodoListContract(todoList);
    setTaskCount(taskCount);
    setTasks(allTask);
  };
  return (
    <div className="App">
      <div className="App-header">
        <p>Your network: {network}</p>
        <p>Your account: {account}</p>
        <p>Contract Address: {contractAddress}</p>
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
                <span>{key + 1} .) </span>
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

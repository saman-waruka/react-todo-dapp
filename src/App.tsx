import { useState } from "react";
import { initTodolistContract } from "./helper/contract";
import "./App.css";
import TodoItem from "./components/TodoItem";
import { Contract } from 'web3-eth-contract' ;
import { TransactionReceipt } from 'web3-core' ;

declare global {
  interface Window {
      ethereum: any;
  }
}


export class Task {
  id: string;
  content: string;
  completed: boolean;
}

const App = () => {
  const [account, setAccount] = useState("");
  const [network, setNetwork] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [tasks, setTasks] = useState([] as Task[]);
  const [taskCount, setTaskCount] = useState(0);
  const [todoListContract, setTodoListContract] = useState(undefined as unknown as Contract);
  const [loading, setLoading] = useState(false);
  const [isConnectedWallet, setIsConnectedWallet] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  console.log(" tasks ", tasks);

  const resetState = () => {
    setAccount("");
    setNetwork("");
    setContractAddress("");
    setTasks([]);
    setTaskCount(0);
    setTodoListContract(undefined as unknown as Contract);
    setLoading(false);
    setIsConnectedWallet(false);
    setIsConnecting(false);
  };

  window.ethereum.on("accountsChanged", (accounts : string[]) => {
    console.log("account changed ", accounts);
    // loadBlockchainData();
    resetState();
  });

  window.ethereum.on("chainChanged", (networkId: string) => {
    console.log(" networkId ", networkId);
    // loadBlockchainData();
    resetState();
  });

  const createTask = (content : string) => {
    setLoading(true);
    todoListContract.methods
      .createTask(content)
      .send({ from: account })
      .once("receipt", async (receipt: TransactionReceipt ) => {
        console.log(" receipt ", receipt);
        setLoading(false);
        const createResult  = receipt.events?.TaskCreated.returnValues;
        const newTask = await todoListContract.methods
          .getTask(createResult.id)
          .call({ from: account });
        setTasks([...tasks, newTask]);
      })
      .once("error", (error: Error) => {
        console.log("Error ocure", error);
        setLoading(false);
      });
  };

  const editTask = (id: string, content: string) => {
    setLoading(true);
    todoListContract
    
    .methods
      .editTask(id, content)
      .send({ from: account })
      .once("receipt", async (receipt: TransactionReceipt) => {
        console.log(" receipt ", receipt);
        const foundIndex = tasks.findIndex((task) => task.id === id);
        console.log("foundIndex : ", foundIndex);
        console.log("tasks[foundIndex] : ", tasks[foundIndex]);
        console.log("type : ", typeof tasks[foundIndex]);
        tasks[foundIndex] = { ...tasks[foundIndex], content };
        setTasks(tasks);
        setLoading(false);
      })
      .once("error", (error: Error) => {
        console.log("Error ocure", error);
        setLoading(false);
      });
  };

  const toggleTaskComplete = (id: string) => {
    setLoading(true);
    todoListContract.methods
      .toggleTaskComplete(id)
      .send({ from: account })
      .once("receipt", (receipt:TransactionReceipt) => {
        console.log(" receipt ", receipt);
        const foundIndex = tasks.findIndex((task) => task.id === id);
        tasks[foundIndex].completed = receipt.events?.TaskCompleted.returnValues.id;
        setTasks(tasks);
        setLoading(false);
      })
      .once("error", (error: { code: number; message: string; stack: string; }) => {
        console.log("Error ocure", error);
        setLoading(false);
        alert(
          `error code: ${error.code} \nMessage: ${error.message} \n\nStack: ${error.stack}`
        );
      })
      
  };

  const loadBlockchainData = async () => {
    setIsConnecting(true);
    console.log("loadBlockchainData  ");
    const { network, account, todoList, contractAddress } =
      await initTodolistContract();
    const taskCount = await todoList.methods
      .getTaskCount()
      .call({ from: account });

    let allTask: Task[] = [];
    let previousTaskId = 0;

    for (let i = 0; i < taskCount; i++) {
      const task = await todoList.methods
        .getNextTask(previousTaskId)
        .call({ from: account });
      allTask.push(task);
      previousTaskId = task.id;
    }

    setContractAddress(contractAddress);
    setNetwork(network);
    setAccount(account);
    setTodoListContract(todoList);
    setTaskCount(taskCount);
    setTasks(allTask);
    setIsConnectedWallet(true);
    setIsConnecting(false);
  };

  const deleteTask = (id: string) => {
    setLoading(true);
    todoListContract.methods
      .deleteTask(id)
      .send({ from: account })
      .once("receipt", async (receipt : TransactionReceipt) => {
        console.log(" receipt ", receipt);
        setLoading(false);
        const createResult = receipt.events?.TaskDeleted.returnValues;
        setTasks(tasks.filter((task) => task.id !== createResult.id));
      })
      .once("error", (error: any) => {
        console.log("Error ocure", error);
        setLoading(false);
      });
  };
  return (
    <div className="App">
      <div className="App-header">
        {!isConnectedWallet && (
          <button
            onClick={() => {
              loadBlockchainData();
            }}
          >
            Connect Wallet
          </button>
        )}

        {isConnecting && <div>Connecting Wallet ...</div>}

        <p>Your network: {network}</p>
        <p>Your account: {account}</p>
        <p>Contract Address: {contractAddress}</p>
        <p>Task Count: {taskCount}</p>
        <form
          onSubmit={(event :any) => {
            event.preventDefault();
            console.log("Event", event.target[0].value);
            createTask(event.target[0].value);
          }}
        >
          <input
            type="text"
            placeholder="Add task..."
            required
            disabled={!isConnectedWallet}
          />
          <input type="submit" value="Submit" disabled={!isConnectedWallet} />
        </form>
        {loading && <div>Loading...</div>}
        {tasks.map((task, id) => {
          return (
            <TodoItem
              key={id}
              id={id}
              task={task}
              toggleTaskComplete={toggleTaskComplete}
              deleteTask={deleteTask}
              editTask={editTask}
            />
          );
        })}
      </div>
    </div>
  );
};

export default App;

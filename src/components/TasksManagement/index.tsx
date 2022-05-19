import { useState, useEffect } from "react";
import TodoItem from "../TodoItem";
import { TransactionReceipt } from "web3-core";
import { useSubscription, useLazyQuery, useQuery, gql } from "@apollo/client";
import { getOriginalId } from "../../helper/graphql";

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

const FETCH_TASKS = gql`
  query Tasks ($owner: String!){
    tasks(owner: $owner) {
      id
      content
      completed
    }
  }
`;

const SUBSCRIPTION_TASKS = gql`
subscription MySubscription2  {
  tasks  {
    id
    content
    completed
  }
}
`;

const TaskManagement = ({ account, contract, isConnectedWallet }: any) => {
  console.log({ account, contract, isConnectedWallet });

  const [tasks, setTasks] = useState([] as Task[]);
  const [taskCount, setTaskCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // const { loading, error, data  } = useSubscription(SUBSCRIPTION_TASKS);

  const [getTasks, { loading, error, data }] = useLazyQuery(FETCH_TASKS, {
    variables: { owner: account },
    pollInterval: 500
  });

  useEffect(() => {
    contract.methods
      .getTaskCount()
      .call({ from: account })
      .then((taskCount: number) => setTaskCount(taskCount));
    getTasks({
      variables: { owner: account },
    });
  }, [account]);

  if (loading) {
    console.log(" Loading ...");
    return <p>Loading......</p>;
  }

  if (error) {
    alert(" error : " + error.message);
  }

  if (data) {
    console.log(" data : ", data);
  }

  const resetState = () => {
    setTasks([]);
    setTaskCount(0);
    setIsLoading(false);
  };

  const createTask = (content: string) => {
    setIsLoading(true);
    contract.methods
      .createTask(content)
      .send({ from: account })
      .once("receipt", async (receipt: TransactionReceipt) => {
        console.log(" receipt ", receipt);
        setIsLoading(false);
        getTasks({
          variables: { owner: account },
        });
        
        // const createResult = receipt.events?.TaskCreated.returnValues;
        // const newTask = await contract.methods
        //   .getTask(createResult.id)
        //   .call({ from: account });
        // setTasks([...tasks, newTask]);
      })
      .once("error", (error: Error) => {
        console.log("Error ocure", error);
        setIsLoading(false);
      });
  };

  const editTask = (id: string, content: string) => {
    setIsLoading(true);
    contract.methods
      .editTask(id, content)
      .send({ from: account })
      .once("receipt", async (receipt: TransactionReceipt) => {
        getTasks({
          variables: { owner: account },
        });
        // console.log(" receipt ", receipt);
        // const foundIndex = tasks.findIndex((task) => task.id === id);
        // console.log("foundIndex : ", foundIndex);
        // console.log("tasks[foundIndex] : ", tasks[foundIndex]);
        // console.log("type : ", typeof tasks[foundIndex]);
        // tasks[foundIndex] = { ...tasks[foundIndex], content };
        // setTasks(tasks);
        setIsLoading(false);
      })
      .once("error", (error: Error) => {
        console.log("Error ocure", error);
        setIsLoading(false);
      });
  };

  const toggleTaskComplete = (id: string) => {
    setIsLoading(true);
    contract.methods
      .toggleTaskComplete(id)
      .send({ from: account })
      .once("receipt", (receipt: TransactionReceipt) => {
        getTasks({
          variables: { owner: account },
        });
        // console.log(" receipt ", receipt);
        // const foundIndex = tasks.findIndex((task) => task.id === id);
        // tasks[foundIndex].completed =
        //   receipt.events?.TaskCompleted.returnValues.id;
        // setTasks(tasks);

        setIsLoading(false);
      })
      .once(
        "error",
        (error: { code: number; message: string; stack: string }) => {
          console.log("Error ocure", error);
          setIsLoading(false);
          alert(
            `error code: ${error.code} \nMessage: ${error.message} \n\nStack: ${error.stack}`
          );
        }
      );
  };

  const deleteTask = (id: string) => {
    setIsLoading(true);
    contract.methods
      .deleteTask(id)
      .send({ from: account })
      .once("receipt", async (receipt: TransactionReceipt) => {
        getTasks({
          variables: { owner: account },
        });
        console.log(" receipt ", receipt);
        setIsLoading(false);
        // const createResult = receipt.events?.TaskDeleted.returnValues;
        // setTasks(tasks.filter((task) => task.id !== createResult.id));
      })
      .once("error", (error: any) => {
        console.log("Error ocure", error);
        setIsLoading(false);
      });
  };

  // const loadBlockchainData = async () => {
  //   setIsConnecting(true);
  //   console.log("loadBlockchainData  ");
  //   const { network, account, todoList, contractAddress } =
  //     await initTodolistContract();
  //   const taskCount = await todoList.methods
  //     .getTaskCount()
  //     .call({ from: account });

  //   let allTask: Task[] = [];
  //   let previousTaskId = 0;

  //   for (let i = 0; i < taskCount; i++) {
  //     const task = await todoList.methods
  //       .getNextTask(previousTaskId)
  //       .call({ from: account });
  //     allTask.push(task);
  //     previousTaskId = task.id;
  //   }

  //   setContractAddress(contractAddress);
  //   setNetwork(network);
  //   setAccount(account);
  //   setTodoListContract(todoList);
  //   setTaskCount(taskCount);
  //   setTasks(allTask);
  //   setIsConnectedWallet(true);
  //   setIsConnecting(false);
  // };

  return (
    <div className="App-header">
      <p>Task Count: {taskCount}</p>
      <form
        onSubmit={(event: any) => {
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
      {(isLoading || loading) && <div>Loading...</div>}
      {data &&
        data.tasks.map((task: Task, id: number) => {
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
      <button
        onClick={() => {
          console.log(" Refetcing", account);
          getTasks({
            variables: { owner: account },
          });
        }}
      >
        {" "}
        Refetch!{" "}
      </button>
    </div>
  );
};

export default TaskManagement;

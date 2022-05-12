/* eslint-disable no-unused-vars */
import { expect } from "chai";
import { ethers } from "hardhat";
import { TodoList } from "./../typechain";

let todoList: TodoList;
describe("TodoList", function () {
  it("The contract is able to deploy", async function () {
    const [deployer] = await ethers.getSigners();
    const TodoList = await ethers.getContractFactory("TodoList");
    todoList = await TodoList.deploy();
    await todoList.deployed();
    console.log("TodoList deployed to: ", todoList.address);
    expect(todoList.address).not.equal(0x0);
    expect(todoList.address).not.equal("");
    expect(todoList.address).not.equal(null);
    expect(todoList.address).not.equal(undefined);
  });

  it("create task", async () => {
    // const [{ address }] = await ethers.getSigners();
    const content = "Test create task";
    const transaction = await todoList.createTask(content);
    const task = await todoList.getTask(1);
    console.log(" task ", task);
    const receipt = await transaction.wait();
    // @ts-ignore
    const eventResult = receipt.events[0].args as TodoList.Task;
    expect(task.id.toNumber()).to.equal(1);
    expect(task.content).to.equal(content);
    expect(task.completed).to.equal(false);
    expect(eventResult.id.toNumber()).to.equal(1);
    expect(eventResult.content).to.equal(content);
  });

  it("list task", async () => {
    const taskCount = await (await todoList.getTaskCount()).toNumber();
    expect(taskCount).to.equal(1);
  });

  it("toggle task completion", async () => {
    const transaction = await todoList.toggleTaskComplete(1);
    const task = await todoList.getTask(1);
    const receipt = await transaction.wait();
    // @ts-ignore
    const eventResult = receipt.events[0].args as TodoList.Task;
    expect(task.completed).to.equal(true);
    expect(eventResult.id.toNumber()).to.equal(1);
    expect(eventResult.completed).to.equal(true);
  });

  it("toggle task to incomplete", async () => {
    const transaction = await todoList.toggleTaskComplete(1);
    const task = await todoList.getTask(1);
    const receipt = await transaction.wait();
    // @ts-ignore
    const eventResult = receipt.events[0].args as TodoList.Task;
    expect(task.completed).to.equal(false);
    expect(eventResult.id.toNumber()).to.equal(1);
    expect(eventResult.completed).to.equal(false);
  });

  it("delete task", async () => {
    const transaction = await todoList.deleteTask(1);
    const receipt = await transaction.wait();
    // @ts-ignore
    const eventResult = receipt.events[0].args as TodoList.Task;
    expect(eventResult.id.toNumber()).to.equal(1);
  });

  it("task count should be 0", async () => {
    const taskCount = await (await todoList.getTaskCount()).toNumber();
    expect(taskCount).to.equal(0);
  });

  // it("delete task should error", async () => {
  //   expect(await todoList.deleteTask(1)).to.throw(/Task NotFound/);
  // });

  // it("access not exists task should error", async () => {
  //   expect(await todoList.getTask(2)).to.throw(/Task NotFound/);
  // });

  // it("access task 0 should error ", async () => {
  //   expect(await todoList.getTask(0)).to.throw(/Task ID must greater than 0/);
  // });
});

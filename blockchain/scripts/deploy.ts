import { ethers } from "hardhat";
import hre from "hardhat";

import fs from "fs";
import path from "path";

async function main() {
  // const [deployer ] = await ethers.getSigners();
  console.log(" --------------- Deploying Smart Contract --------------- ");
  const contractAddress = {
    todoContract: "",
  };

  const TodoList = await ethers.getContractFactory("TodoList");
  const todoList = await TodoList.deploy();
  await todoList.deployed();
  console.log("TodoList deployed to: ", todoList.address);
  contractAddress.todoContract = todoList.address;

  console.log(
    " --------------- Deploy Smart Contract Success --------------- "
  );

  console.log(" Copying to frontend ... ");
  // write address
  const resultAddressPath = path.join(
    __dirname,
    `./../../src/constants/address/${hre.network.name}.json`
  );
  console.log(" writing contract address to frontend ... ");
  fs.writeFileSync(resultAddressPath, JSON.stringify(contractAddress, null, 2));
  console.log(" write contract address to frontend success. ");

  const todoArtifact = await hre.artifacts.readArtifact("TodoList");
  const resultAbiPath = path.join(
    __dirname,
    `./../../src/constants/abi/${todoArtifact.contractName}.json`
  );
  console.log(" writing contract abi to frontend ... ");

  fs.writeFileSync(resultAbiPath, JSON.stringify(todoArtifact.abi, null, 2));
  console.log(" writing contract abi to frontend success. ");

  console.log(" Copy to frontend Success ");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

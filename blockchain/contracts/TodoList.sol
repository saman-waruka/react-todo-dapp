//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract TodoList {
    
    struct Task {
        uint256 id;
        string content;
        bool completed;
    }

    mapping(address => uint256) public totalTask;
    mapping(address => Task[]) public tasks;

    event TaskCreated(uint256 id, string content, bool completed);
    event TaskEdited(uint256 id, string content, bool completed);
    event TaskCompleted(uint256 id, bool completed);

    function createTask(string memory _content) public {
        uint256 taskIndex = tasks[msg.sender].length;
        tasks[msg.sender].push(Task(taskIndex, _content, false));
        totalTask[msg.sender] += 1;
        emit TaskCreated(taskIndex, _content, false);
    }

    function editTask(uint256 _id, string memory _content) public {
        tasks[msg.sender][_id].content = _content;
        emit TaskEdited(_id, _content, tasks[msg.sender][_id].completed);
    }

    function toggleTaskComplete(uint256 _id) public {
        tasks[msg.sender][_id].completed = !tasks[msg.sender][_id].completed;
        emit TaskCompleted(_id, tasks[msg.sender][_id].completed);
    }

    function getTaskCount() public view returns (uint256 total) {
        return tasks[msg.sender].length;
    }

    function getTasks() public view returns (Task[] memory) {
        return tasks[msg.sender];
    }
}

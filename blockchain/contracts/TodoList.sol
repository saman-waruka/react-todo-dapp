//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract TodoList {

    struct Task {
        uint256 id;
        string content;
        bool completed;
    }

    mapping(address => Task[]) public tasks;

    event TaskCreated(uint256 id, string content, bool completed );
    event TaskEdited(uint256 id, string content, bool completed );
    event TaskCompleted(uint256 id, bool completed);

    function createTask(string memory _content) public {
        uint taskIndex = tasks[msg.sender].length;
        Task memory newTask = Task(taskIndex, _content, false);
        tasks[msg.sender].push(newTask);
        emit TaskCreated(taskIndex, _content, false);
    }

    function editTask(uint256 _id, string memory _content) public {
        Task memory _task = tasks[msg.sender][_id];
        _task.content = _content;
        tasks[msg.sender][_id] = _task;
        emit TaskEdited(_id, _content, _task.completed);
    }

    function toggleTaskComplete(uint256 _id) public {
        Task memory _task = tasks[msg.sender][_id];
        _task.completed = !_task.completed;
        tasks[msg.sender][_id] = _task;
        emit TaskCompleted(_id,_task.completed);
    }

    function getTaskCount() public view returns (uint256){
        return tasks[msg.sender].length;
    }

    function getTasks() public view returns(Task[] memory) {
        return tasks[msg.sender];
    }

 
}

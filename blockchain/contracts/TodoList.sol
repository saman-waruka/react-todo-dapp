//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "solidity-linked-list/contracts/StructuredLinkedList.sol";

contract TodoList {
    struct Task {
        uint256 id;
        string content;
        bool completed;
    }

    using StructuredLinkedList for StructuredLinkedList.List;

    // use for manage which task left after remove
    mapping(address => StructuredLinkedList.List) private idLinklist;
    mapping(address => mapping(uint256 => Task)) private tasks;
    // use for generate id from 1 to 2^256-1
    mapping(address => uint256) private taskId;

    constructor() {
        // start count by 1 because 0 cannot use with linklist node
        taskId[msg.sender] = 1;
    }

    event TaskCreated(uint256 id, string content);
    event TaskEdited(uint256 id, string content, bool completed);
    event ToggleTaskCompleted(uint256 id, bool completed);
    event TaskDeleted(uint256 id);

    function createTask(string memory _content) public {
        uint256 id = taskId[msg.sender];
        tasks[msg.sender][id] = Task(id, _content, false);
        taskId[msg.sender]++;
        StructuredLinkedList.pushBack(idLinklist[msg.sender], id);
        emit TaskCreated(id, _content);
    }

    function getTaskCount() public view returns (uint256) {
        return StructuredLinkedList.sizeOf(idLinklist[msg.sender]);
    }

    function validateValidTaskId(uint256 _id) private view {
        require(_id > 0, "Task ID must greater than 0");
        bool nodeExist;
        (nodeExist, , ) = StructuredLinkedList.getNode(
            idLinklist[msg.sender],
            _id
        );
        require(nodeExist, "Task NotFound");
    }

    function getTask(uint256 _id) public view returns (Task memory) {
        validateValidTaskId(_id);
        return tasks[msg.sender][_id];
    }

    function toggleTaskComplete(uint256 _id) public {
        validateValidTaskId(_id);
        tasks[msg.sender][_id].completed = !tasks[msg.sender][_id].completed;
        emit ToggleTaskCompleted(_id, tasks[msg.sender][_id].completed);
    }

    function editTask(uint256 _id, string memory _content) public {
        validateValidTaskId(_id);
        tasks[msg.sender][_id].content = _content;
        emit TaskEdited(_id, _content, tasks[msg.sender][_id].completed);
    }

    function deleteTask(uint256 _id) public {
        validateValidTaskId(_id);
        StructuredLinkedList.remove(idLinklist[msg.sender], _id);
        emit TaskDeleted(_id);
    }

    function getNextTask(uint256 _id) public view returns (Task memory) {
        uint256 firstNode;
        bool nodeExists;
        (nodeExists, firstNode) = StructuredLinkedList.getNextNode(
            idLinklist[msg.sender],
            _id
        );
        require(nodeExists, "You don have any task");
        return tasks[msg.sender][firstNode];
    }
}

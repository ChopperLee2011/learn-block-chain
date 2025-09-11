// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Todo {
    enum Status {
        Pending,
        Processing,
        Completed,
        Canceled
    }

    struct Task {
        Status status;
        string text;
        uint timestamp;
        address creator;
    }
    Task[] public todos;

    event TaskLog(uint indexed taskId, address indexed user, Status newStatus);

    constructor() {}

    function createTask(string calldata _text) external {
        require(bytes(_text).length > 0, "Task text cannot be empty");

        uint taskId = todos.length;
        Task memory task = Task({
            status: Status.Pending,
            text: _text,
            timestamp: block.timestamp,
            creator: msg.sender
        });

        todos.push(task);
        emit TaskLog(taskId, msg.sender, Status.Pending);
    }

    function removeTask(uint idx) external {
        uint taskNum = todos.length;
        require(idx < taskNum, "Task index out of bounds");
        todos[idx] = todos[taskNum - 1];
        todos.pop();

        emit TaskLog(idx, msg.sender, Status.Canceled);
    }

    function updateTaskStatus(uint idx, Status _status) external {
        require(idx < todos.length, "Task index out of bounds");
        todos[idx].status = _status;
        emit TaskLog(idx, msg.sender, _status);
    }

    function getTodos() external view returns (Task[] memory) {
        return todos;
    }
}

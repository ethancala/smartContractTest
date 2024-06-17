// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract todoList{

    //here we create a counter for the number of tasks
    uint public taskCount = 0;

    //here we create a task structure made up ID, content, and status traits
    struct Task{
        uint ID;
        string content;
        bool completed;
    }

    //here we map each task to a unique ID
    mapping(uint => Task) public tasks;

    //events for creating tasks and completing tasks

    event TaskCreated(uint ID, string content, bool completed);
    event TaskCompleted(uint ID, bool completed);

    constructor() {
        createTask("Check out the first task");
    }


    function createTask(string memory _content) public{
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);
        emit TaskCreated(taskCount, _content, false);
    }

    function toggleTaskCompleted(uint _id) public {
        Task memory _task = tasks[_id];
        _task.completed = !_task.completed;
        tasks[_id] = _task;
        emit TaskCompleted(_id, _task.completed);
    }
    
}
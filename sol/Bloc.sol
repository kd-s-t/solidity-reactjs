// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Pine is ERC20, Ownable {
    constructor() ERC20("Pine", "PINE") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    // Defining a structure to
    // store a task
    struct Task
    {
        string task;
        bool isDone;
    }

    mapping (address => Task[]) private Users;
        
    // Defining function to add a task
    function addTask(string calldata _task) external
    {
        Users[msg.sender].push(Task({
            task:_task,
            isDone:false
        }));
    }

    // Defining a function to get details of a task
    function getTask(uint _taskIndex) external view returns (Task memory)
    {
        Task storage task = Users[msg.sender][_taskIndex];
        return task;
    }

    // Defining a function to update status of a task
    function updateStatus(uint256 _taskIndex,bool _status) external
    {
        Users[msg.sender][_taskIndex].isDone = _status;
    }

    // Defining a function to delete a task
    function deleteTask(uint256 _taskIndex) external
    {
        delete Users[msg.sender][_taskIndex];
    }

    // Defining a function to get task count.
    function getTaskCount() external view returns (uint256)
    {
        return Users[msg.sender].length;
    }
}

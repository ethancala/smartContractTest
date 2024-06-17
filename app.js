const contractABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "ID",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "content",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "completed",
                "type": "bool"
            }
        ],
        "name": "TaskCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_ID",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "completed",
                "type": "bool"
            }
        ],
        "name": "TaskCompleted",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "taskCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_content",
                "type": "string"
            }
        ],
        "name": "createTask",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_ID",
                "type": "uint256"
            }
        ],
        "name": "toggleTaskCompleted",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "tasks",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "ID",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "content",
                "type": "string"
            },
            {
                "internalType": "bool",
                "name": "completed",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
const contractAddress = '<YOUR_DEPLOYED_CONTRACT_ADDRESS>';

let web3;
let todoList;

window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.enable();
        } catch (error) {
            console.error("User denied account access");
        }
    } else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider);
    } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
    todoList = new web3.eth.Contract(contractABI, contractAddress);
    loadTasks();
});

async function loadTasks() {
    const taskCount = await todoList.methods.taskCount().call();
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    for (let i = 1; i <= taskCount; i++) {
        const task = await todoList.methods.tasks(i).call();
        const taskElement = document.createElement('li');
        taskElement.innerHTML = `${task.content} <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask(${task.ID})">`;
        taskList.appendChild(taskElement);
    }
}

async function createTask() {
    const content = document.getElementById('newTask').value;
    const accounts = await web3.eth.getAccounts();
    await todoList.methods.createTask(content).send({ from: accounts[0] });
    loadTasks();
}

async function toggleTask(ID) {
    const accounts = await web3.eth.getAccounts();
    await todoList.methods.toggleTaskCompleted(ID).send({ from: accounts[0] });
    loadTasks();
}

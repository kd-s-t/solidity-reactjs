import { useEffect, useState } from 'react';
import {contractAddress, contractABI} from "./config";
const Web3 = require('web3');
const BigNumber = require("bignumber.js");

if (typeof window.ethereum !== 'undefined') {
  // console.log('MetaMask is installed!');
}else{
  console.log('Please install metamask!');
}

const NumberFormatter = (value, decimal) => {
  return parseFloat(parseFloat(value).toFixed(decimal)).toLocaleString(
    "en-IN",
    {
      useGrouping: true,
    }
  );};

function App() {
  const [tasks,setTasks] = useState([])
  const [name,setName] = useState("")
  const [defaultAccount,setDefaultAccount] = useState("")
  const [balance,setBalance] = useState(0)
  const [contract,setContract] = useState([])

  const addTask = async () => {
    await contract.methods.addTask(name).send({ from: defaultAccount });
  }

  const getAllTask = async (contract, defaultAccount) => {
    const numberOfTask = await contract.methods.getTaskCount().call({ from: defaultAccount });
    let taskIterator = 0
    let contain_tasks = []
    while ( taskIterator < numberOfTask) {
      try {
        let task = await contract.methods.getTask(taskIterator).call({ from: defaultAccount });
        if (task[0] !== '') {
          contain_tasks.push({
            id: taskIterator,
            task: task['task'],
            isDone: task['isDone']
          })
        }
        else {
          // console.log('The index ' + taskIterator + ' is empty');
        }
      } catch {
        console.log('Failed to get Task ' + taskIterator);
      }
      taskIterator++;
    }
    return contain_tasks
  }

  // eslint-disable-next-line
  const updateTask = async (task, checked) => {
		await contract.methods.updateStatus(task.id, checked).send({ from: defaultAccount });
  }

  const deleteTask = async (task, key) => {
		await contract.methods.deleteTask(task.id).send({ from: defaultAccount });
  }

  useEffect(() => {

    async function fetchData() {
      let web3
      if (window.web3) {
        web3 = new Web3(window.web3.currentProvider);
      }

      let accounts = await web3.eth.getAccounts();
      web3.eth.defaultAccount = accounts[0];
      let contract = await new web3.eth.Contract(contractABI, contractAddress);
      setContract(contract)
      setDefaultAccount(accounts[0])

      const bal = await contract.methods.balanceOf(contractAddress).call({ from: contractAddress });
      const decimals = await contract.methods.decimals().call();
      const bn = new BigNumber(bal + "e-" + decimals);
      let o = parseFloat(bn.toString()).toFixed(2)
      setBalance(Number(o).toLocaleString('en'))

      let allTask = await getAllTask(contract, web3.eth.defaultAccount) 
      setTasks(allTask)
    }
    fetchData()
  // eslint-disable-next-line
  }, [])

  return (
    <div className="App">
      <div>Account: {defaultAccount}</div>
      <div>Balance: PINE {balance}</div>
      {tasks.map((val, key) => {
        return <div key={key}>{val.task} <button type="button" onClick={() => deleteTask(val,key)}>[delete]</button></div>
      })}
      <div>
        Name: <input name="name" onChange={(e) => setName(e.target.value)} />
        <button type="button" onClick={() => addTask()}>[add]</button>
      </div>
    </div>
  );
}

export default App;

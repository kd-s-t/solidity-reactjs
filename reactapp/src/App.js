import { useEffect, useState } from 'react';
import {contractAddress, contractABI} from "./config";
const Web3 = require('web3');

function App() {
  const [tasks,setTasks] = useState([])
  const [name,setName] = useState("")
  const [defaultAccount,setDefaultAccount] = useState("")
  const [contract,setContract] = useState([])

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

  const deleteTask = async (task, key) => {
		await contract.methods.deleteTask(task.id).send({ from: defaultAccount });
  }

  const addTask = async () => {
    await contract.methods.addTask(name).send({ from: defaultAccount });
  }

  useEffect(() => {
    async function fetchData() {
      const web3 = new Web3('ws://localhost:8545');
      let accounts = await web3.eth.getAccounts();
      web3.eth.defaultAccount = accounts[0];
      let contract = await new web3.eth.Contract(contractABI, contractAddress);
      setContract(contract)
      setDefaultAccount(accounts[0])

      let allTask = await getAllTask(contract, web3.eth.defaultAccount) 
      setTasks(allTask)
    }
    fetchData()
  // eslint-disable-next-line
  }, [])

  return (
    <div className="App">
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

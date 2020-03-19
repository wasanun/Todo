import React, { useState, useEffect } from 'react';
import { firestore } from './index'
import Task from './Task'
 
const App = () => {
   const [tasks, setTasks] = useState([])
   const [name, setName] = useState('')
 
   const retriveData = () => {
       firestore.collection("tasks").orderBy('id', 'asc').onSnapshot(snapshot => {
           let myTask = snapshot.docs.map(d => {
               const { id, name } = d.data()
               return {id,name }
           })
           setTasks(myTask)
       })
   }
 
   useEffect(() => {
       retriveData()
   }, [])
 
   const addTask = async () => {
       let id = (tasks.length === 0) ? 1 : tasks[tasks.length - 1].id + 1
       firestore.collection("tasks").doc(id + '').set({ id, name })
   }
 
   const removeTask = (id) => {
       firestore.collection("tasks").doc(id + '').delete()
   }
 
   const editTask = (id) => {
       firestore.collection("tasks").doc(id + '').set({ id, name })
   }
 
   const renderTask = () => {
       if (tasks && tasks.length) {
           return tasks.map((task, index) => (
               <Task key={index}
                   task={task}
                   editTask={editTask}
                   removeTask={removeTask} />
           ))
       }
       else {
           return <div>No Task</div>
       }
   }
 
   return (
       <div style={{ margin: '40px' }}>
           <h2>Todo: </h2>
           <input type="text" name="name" onChange={(e) => setName(e.target.value)} />
           <button onClick={addTask}>Submit</button> <br />
           <ul style={{ display: 'flex', listStyle: 'none' }}> {renderTask()}</ul>
       </div>
   )
}
 
export default App;
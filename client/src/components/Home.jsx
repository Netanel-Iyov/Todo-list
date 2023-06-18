import { useState, useEffect, Fragment } from "react";

const API_BASE = "http://localhost:3001"



const HomePage = () => {
    const [todos, setTodos] = useState([]);
    const [popupActive, setPopupActive] = useState(false)
    const [newTodo, setNewTodo] = useState("")

    useEffect (() => {
        GetTodos();
    }, [])

    const GetTodos = () => {
        const token = localStorage.token
        const requestOptions = {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({token: token})
        }

        fetch(API_BASE + '/todos', requestOptions)
        .then(res => res.json())
        .then(data => setTodos(data))
        .catch(err => console.error("While getting Todos the following error occured : ", err))
    }

    const completeTodo = async (id) => {
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-type': 'application/json'}
        }
        const data = await fetch(API_BASE + '/todo/complete/' + id, requestOptions)
            .then(res => res.json())

        setTodos(todos => todos.map(todo => {
            if (todo._id === data._id) {
                todo.complete = data.complete
            }

            return todo
        }))
    }

    const deleteTodo = async (id) => {
        const requestOptions = {
            method: 'DELETE'
        }
        const deletedTodo = await fetch(API_BASE + '/todo/delete/' + id, requestOptions)
        .then(res => res.json()).then(data => console.log('"' + data.text + '" Was deleted successfully'))

        GetTodos()
    }

    const addTodo = async (text) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({token: localStorage.token, "text": text}) 
        }
        const response = await fetch(API_BASE + '/todo/new/', requestOptions)
        .then(res => res.json())
        .catch('Error adding data has occured')

        setTodos([...todos, response])
        setPopupActive(false)
        setNewTodo("")
    }


    return (
      <div className="App">
            <h1>Welcome, {`${localStorage.name}`} </h1>
            <h4>Your tasks</h4>

            <div className="todos">
                { todos.map(todo => ( 
                    <div className={"todo " + (todo.complete ? "is-complete" : "")} 
                    key={todo._id} onClick={() => completeTodo(todo._id)}>
                        <div className="checkbox"></div>
                        <div className="text">{todo.text}</div>
                        <div className="delete-todo" onClick={(event) => {
                                event.stopPropagation()
                                deleteTodo(todo._id)}
                            }>x</div>
                    </div>
                )) } 
            </div>

            <div className="addPopup" onClick={() => setPopupActive(true)}>+</div>
            {popupActive ? (
                <Fragment> 
                <div className="popup">    
                    <div className="closePopup" onClick={() => setPopupActive(false)}>x</div>
                    <div className="content">
                        <h3>Add Task</h3>
                        <input 
                            type="text" 
                            className="add-todo-input" 
                            onChange={(e) => { setNewTodo(e.target.value)}}
                            value={newTodo}
                        />
                    <button className="button" onClick={(event) =>  {
                                    event.stopPropagation()
                                    addTodo(newTodo)}
                                    }>Create Task</button>
                    </div>
                </div>
                </Fragment>
            ) : ""}
            
      </div>
    );
}

export default HomePage;
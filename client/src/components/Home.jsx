import { useState, useEffect, useLayoutEffect, Fragment } from "react";
import { useNavigate } from 'react-router-dom';
import { checkIfConnected, API_BASE } from '../utils/utils'


const HomePage = () => {
    document.title = 'Home';
    const navigate = useNavigate();

    const [todos, setTodos] = useState([]);
    const [popupActive, setPopupActive] = useState(false)
    const [newTodo, setNewTodo] = useState("")


    useEffect (() => {
        handleConnection();
        GetTodos();
    }, [])

    const handleConnection = () => {
        if (!checkIfConnected()) {
            navigate("/")
        }
    }

    const GetTodos = async () => {
        const token = localStorage.token
        const requestOptions = {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({token: token})
        }

        try {
            const response = await fetch(API_BASE + '/todos', requestOptions)
            if (response.status === 401) {
                localStorage.clear()
                navigate('/')
            }
            if (response.ok) {
                const data = await response.json()
                setTodos(data)
            }
        } catch(error) {
            console.error("While getting Todos the following error occured : ", error)
        }
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
        if (text === '') {
            return
        }
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

    const signOut = () => {
        localStorage.clear()
        navigate('/login')
    }


    return (
      <div className="p-8">
            <h1 className="text-4xl font-bold mb-8">Welcome, {`${localStorage.first_name}`} </h1>
            <h4 className="text-base text-[#61759b] uppercase font-normal mb-4">Your tasks</h4>

            <div>
                { todos.map(todo => ( 
                    <div className={"relative bg-[#131A26] p-4 rounded-2xl flex items-center transition duration-500 cursor-pointer mb-4 hover:opacity-80"} 
                    key={todo._id} onClick={() => completeTodo(todo._id)}>
                        <div className={"w-5 h-5 mr-4 rounded-full bg-[#61759b] transition duration-400 " + (todo.complete ? " bg-[#D81E5B] bg-gradient-to-b from-[#D81E5B] to-[#8A4EFC]":"")}></div>
                        <div className={"text-base" + (todo.complete ? " line-through" : "")}>{todo.text}</div>
                        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 w-6 h-6 text-[#EEE] bg-[#AF1E2D] rounded-full flex items-center justify-center" onClick={(event) => {
                                event.stopPropagation()
                                deleteTodo(todo._id)}
                            }>x</div>
                    </div>
                )) } 
            </div>
            
            <div className="fixed bottom-8 left-8 flex items-center justify-center w-32 h-12 rounded-full text-base font-bold text-gray-200 bg-gradient-to-br from-[#D81E5B] to-[#8A4EFC] cursor-pointer" onClick={() => signOut(true)}>Sign Out</div>

            <div className="fixed bottom-8 right-8 flex items-center justify-center w-32 h-12 rounded-full text-base font-bold text-gray-200 bg-gradient-to-br from-[#D81E5B] to-[#8A4EFC] cursor-pointer" onClick={() => setPopupActive(true)}>Add Task</div>
            {popupActive ? (
                <Fragment> 
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] bg-[#EEE] p-8 rounded-lg shadow-lg">    
                    <div className="text-light absolute right-4 top-4 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-[#D81E5B]" onClick={() => setPopupActive(false)}>x</div>
                    <div>
                        <h3 className='text-black mb-4 font-normal'>Add Task</h3>
                        <input 
                            type="text" 
                            className="appearance-none h-10 min-w-max border-0 focus:border-purple-600 outline-none bg-white p-4 rounded-2xl shadow-md w-full text-lg" 
                            onChange={(e) => { setNewTodo(e.target.value)}}
                            value={newTodo}
                        />

                        <button className="mt-4 h-9 w-40 translate-x-20 transform cursor-pointer rounded-3xl bg-gradient-to-r from-[#D81E5B] to-[#8A4EFC] text-center text-lg font-semibold" 
                                onClick={ (event) =>  {
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
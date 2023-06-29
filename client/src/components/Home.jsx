import { useState, useEffect, useLayoutEffect, Fragment } from "react";
import { useNavigate } from 'react-router-dom';
import { checkIfConnected, API_BASE } from '../utils/utils'
import { PlusCircleIcon, ArrowLeftCircleIcon, XCircleIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/20/solid'


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
            
            <div className="flex justify-between">
                <h4 className="order-1 text-base text-[#61759b] uppercase font-normal mb-4">Your tasks</h4>
{/*                 
                <button id="dropdownRadioBgHoverButton" data-dropdown-toggle="dropdownRadioBgHover" className="order-2 transform -translate-y-6 -translate-x-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">Dropdown radio <svg className="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button>

                <div id="dropdownRadioBgHover" className="z-10 hidden w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
                    <ul className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownRadioBgHoverButton">
                        <li>
                            <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                <input id="default-radio-4" type="radio" value="Option 1" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"></input>
                                <label for="default-radio-4" className="w-full ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">Default radio</label>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="flex justify-between">
                <div className="relative w-full lg:max-w-sm">
                    <select className="w-full p-2.5 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600">
                        <option>ReactJS Dropdown</option>
                        <option>Laravel 9 with React</option>
                        <option>React with Tailwind CSS</option>
                        <option>React With Headless UI</option>
                    </select>
                </div> */}
            </div>
            
            
            <div>
                { todos.map(todo => ( 
                    <div className={"relative bg-[#131A26] p-4 rounded-2xl flex items-center transition duration-500 cursor-pointer mb-4 hover:opacity-80"} 
                    key={todo._id} onClick={() => completeTodo(todo._id)}>
                        <div className={"w-5 h-5 mr-4 rounded-full bg-[#61759b] transition duration-400 " + (todo.complete ? " bg-[#D81E5B] bg-gradient-to-b from-[#D81E5B] to-[#8A4EFC]":"")}></div>
                        <div className={"text-base" + (todo.complete ? " line-through" : "")}>{todo.text}</div>
                            <TrashIcon className="fill-[#D81E5B] absolute top-1/2 right-4 transform -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center" 
                                onClick={(event) => {
                                    event.stopPropagation()
                                    deleteTodo(todo._id)
                                }
                            }/>
                            <PencilSquareIcon className="absolute top-1/2 right-12 transform -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center" 
                                onClick={(event) => {
                                event.stopPropagation()
                                }
                            }/>

                    </div>
                )) } 
            </div>
            
            <div className="fixed bottom-8 left-8 flex items-center justify-center w-32 h-12 rounded-full text-base font-bold text-gray-200 bg-gradient-to-br from-[#D81E5B] to-[#8A4EFC] cursor-pointer" onClick={() => signOut(true)}>Sign Out&nbsp;
                <ArrowLeftCircleIcon className="h-6 w-6"/> 
            </div>
            

            <div className="fixed bottom-8 right-8 flex items-center justify-center w-32 h-12 rounded-full text-base font-bold text-gray-200 bg-gradient-to-br from-[#D81E5B] to-[#8A4EFC] cursor-pointer" onClick={() => setPopupActive(true)}>
                Add Task&nbsp;
                <PlusCircleIcon className="h-6 w-6"/>
            </div>
            {popupActive ? (
                <Fragment> 
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] bg-[#EEE] p-8 rounded-lg shadow-lg">    
                    <XCircleIcon className="fill-[#D81E5B] absolute top-6 right-3 cursor-pointer transform -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center" onClick={() => setPopupActive(false)}/>
                    <div>
                        <h3 className='text-gray-800 mb-4 font-bold'>Add Task</h3>
                        <input 
                            type="text" 
                            className="translate-y-2 text-gray-800 appearance-none h-10 min-w-max border-0 focus:border-purple-600 outline-none bg-white p-4 rounded-2xl shadow-md w-full text-base" 
                            onChange={(e) => {setNewTodo(e.target.value)}}
                            value={newTodo}
                        />

                        <button className="translate-y-4 mt-4 h-9 w-40 translate-x-20 transform cursor-pointer rounded-3xl bg-gradient-to-r from-[#D81E5B] to-[#8A4EFC] text-center text-lg font-semibold" 
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
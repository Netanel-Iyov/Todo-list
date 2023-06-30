import { useState, useEffect, useRef , Fragment } from "react";
import { useNavigate } from 'react-router-dom';
import { checkIfConnected, API_BASE } from '../utils/utils'
import { PlusCircleIcon, ArrowLeftCircleIcon, XCircleIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/20/solid'


const HomePage = () => {
    document.title = 'Home';
    const navigate = useNavigate();

    const [todos, setTodos] = useState([]);
    
    const [newPopupActive, setNewPopupActive] = useState(false)
    const [newTodo, setNewTodo] = useState("")

    const [editPopUpActive, setEditPopupActive] = useState(false)
    const [todoToEdit, setTodoToEdit] = useState(undefined)
    const [todoToEditText, setTodoToEditText] = useState("")
    


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
        setNewPopupActive(false)
        setNewTodo("")
    }

    const editTodo = async(TodoObject) => {
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({text: todoToEditText})
        }
        await fetch(API_BASE + `/todo/update/${TodoObject._id}`, requestOptions)
            .then(res => res.json())

        GetTodos()

        setEditPopupActive(false)
        setTodoToEdit(undefined)
        setTodoToEditText("")
    }

    const signOut = () => {
        localStorage.clear()
        navigate('/login')
    }

    const createPopupFragment = (title, inputValue, setInputValue, buttonText, buttonAction, exitOnClick) => {
        return (
          <Fragment>
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] bg-[#EEE] p-8 rounded-lg shadow-lg">
              <XCircleIcon
                className="fill-[#D81E5B] absolute top-6 right-3 cursor-pointer transform -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center"
                onClick={() => exitOnClick(false)}
              />
              <div>
                <h3 className="text-gray-800 mb-4 font-bold">{title}</h3>
                <input
                  id="popUpTextInput"
                  type="text"
                  className="translate-y-2 text-gray-800 appearance-none h-10 min-w-max border-0 focus:border-purple-600 outline-none bg-white p-4 rounded-2xl shadow-md w-full text-base"
                  onChange={(e) => setInputValue(e.target.value)}
                  value={inputValue}
                />
      
                <button
                  className="translate-y-4 mt-4 h-9 w-40 translate-x-20 transform cursor-pointer rounded-3xl bg-gradient-to-r from-[#D81E5B] to-[#8A4EFC] text-center text-lg font-semibold"
                  onClick={(event) => {
                    event.stopPropagation();
                    buttonAction();
                  }}
                > {buttonText} </button>
              </div>
            </div>
          </Fragment>
        );
      };

    const createNewPopUpFragment = () => {
    return createPopupFragment('Add Task', newTodo, setNewTodo, 'Create Task', () => addTodo(newTodo), setNewPopupActive)
    }
      
    const createEditPopUpFragment = () => {
    return createPopupFragment('Edit Task', todoToEditText, (value) => setTodoToEditText(value), 'Update', () => editTodo(todoToEdit), setEditPopupActive)
    }

    return (
      <div className="p-8">
            <h1 className="text-4xl font-bold mb-8">Welcome, {`${localStorage.first_name}`} </h1>
            
            <div className="flex justify-between">
                <h4 className="order-1 text-base text-[#61759b] uppercase font-normal mb-4">Your tasks</h4>
            </div>
            
            
            <div>
                { todos.map(todo => ( 
                    <div className="relative bg-[#131A26] p-4 rounded-2xl flex items-center transition duration-500 cursor-pointer mb-4 hover:opacity-80" key={todo._id} onClick={() => completeTodo(todo._id)}>
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
                                    setEditPopupActive(true)
                                    setTodoToEdit(todo)
                                    setTodoToEditText(todo.text)
                                }
                            }/>

                    </div>
                )) } 
            </div>
            
            <div className="fixed bottom-8 left-8 flex items-center justify-center w-32 h-12 rounded-full text-base font-bold text-gray-200 bg-gradient-to-br from-[#D81E5B] to-[#8A4EFC] cursor-pointer" onClick={() => signOut(true)}>Sign Out&nbsp;
                <ArrowLeftCircleIcon className="h-6 w-6"/> 
            </div>
            

            <div className="fixed bottom-8 right-8 flex items-center justify-center w-32 h-12 rounded-full text-base font-bold text-gray-200 bg-gradient-to-br from-[#D81E5B] to-[#8A4EFC] cursor-pointer" onClick={() => setNewPopupActive(true)}>
                Add Task&nbsp;
                <PlusCircleIcon className="h-6 w-6"/>
            </div>

            {newPopupActive ? createNewPopUpFragment() : ""}
            {editPopUpActive ? createEditPopUpFragment() : ""}
            
      </div>
    );
}

export default HomePage;
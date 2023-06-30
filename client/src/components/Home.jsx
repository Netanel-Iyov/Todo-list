import { useState, useEffect , Fragment } from "react";
import { useNavigate } from 'react-router-dom';
import { checkIfConnected, API_BASE } from '../utils/utils'
import { PlusCircleIcon, ArrowLeftCircleIcon, XCircleIcon, TrashIcon, PencilSquareIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'


const HomePage = () => {
    document.title = 'Home';
    const navigate = useNavigate();

    const [todos, setTodos] = useState([]);
    
    const [todoTitle, setTodoTitle] = useState("")
    const [todoDescription, setTodoDescription] = useState("")

    const [newPopupActive, setNewPopupActive] = useState(false)
    const [editPopUpActive, setEditPopupActive] = useState(false)

    const [todoToEdit, setTodoToEdit] = useState(undefined)

    const [toggleCollapse, setToggleCollapse] = useState([])
    

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
                setToggleCollapse(Array.from({ length: data.length }).fill(false))
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
        .then(res => res.json()).then(data => console.log('"' + data.title + '" Was deleted successfully'))

        GetTodos()
    }

    const addTodo = async (title, description) => {
        if (title === '') {
            return
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({token: localStorage.token, "title": title, "description": description === '' ? ' ' : description}) 
        }
        const response = await fetch(API_BASE + '/todo/new/', requestOptions)
        .then(res => res.json())
        .catch('Error adding data has occured')

        setTodos([...todos, response])
        setNewPopupActive(false)
        setTodoTitle("")
        setTodoDescription("")
    }

    const editTodo = async(TodoObject) => {
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({title: todoTitle, description: todoDescription})
        }
        await fetch(API_BASE + `/todo/update/${TodoObject._id}`, requestOptions)
            .then(res => res.json())

        GetTodos()

        setEditPopupActive(false)
        setTodoToEdit(undefined)
        setTodoTitle("")
        setTodoDescription("")
    }

    const signOut = () => {
        localStorage.clear()
        navigate('/login')
    }

    const createPopupFragment = (popUpHeader, buttonText, buttonAction, exitOnClick) => {
        return (
          <Fragment>
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] bg-[#EEE] p-2 pb-8 rounded-lg shadow-lg">
              <XCircleIcon
                className="fill-[#D81E5B] absolute top-4 right-2 cursor-pointer transform -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center"
                onClick={() => exitOnClick(false)}
              />
              <div>
                <h3 className="text-gray-800 mb-1 mt-1 font-bold text-lg flex justify-center">{popUpHeader}</h3>
                <label className="text-gray-800 text-base p-0">Title</label>
                <input
                  id="popUpTitleInput"
                  type="text"
                  className="translate-y-2 text-gray-800 h-8 min-w-max border-0 focus:border-purple-800 outline-none bg-white rounded-md shadow-md w-full text-base mb-4"
                  onChange={(e) => setTodoTitle(e.target.value)}
                  value={todoTitle}
                />

                <label className="text-gray-800">Description</label>
                <textarea 
                  id="popUpDescriptionInput"
                  rows="10"
                  className="translate-y-2 text-gray-800 appearance-none h-36 min-w-max border-0 focus:border-purple-800 outline-none bg-white rounded-md shadow-md w-full text-base"
                  onChange={(e) => setTodoDescription(e.target.value)}
                  value={todoDescription}
                />
      
                <button
                  className="translate-y-4 mt-4 h-9 w-40 translate-x-28 transform cursor-pointer rounded-3xl bg-gradient-to-r from-[#D81E5B] to-[#8A4EFC] text-center text-lg font-semibold"
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
    return createPopupFragment('Add Task', 'Create Task', () => addTodo(todoTitle, todoDescription), setNewPopupActive)
    }
      
    const createEditPopUpFragment = () => {
    return createPopupFragment('Edit Task', 'Update Task', () => editTodo(todoToEdit), setEditPopupActive)
    }

    return (
      <div className="p-8">
            <h1 className="text-4xl font-bold mb-8">Welcome, {`${localStorage.first_name}`} </h1>
            
            <div className="flex justify-between">
                <h4 className="order-1 text-base text-[#61759b] uppercase font-normal">Your tasks</h4>
            </div>

            <div>
                { todos.map((todo, index) => ( 
                    <div key={todo._id}>
                        <div className="relative bg-[#131A26] p-4 rounded-2xl flex items-center transition duration-500 cursor-pointer mt-4 hover:opacity-80" onClick={() => completeTodo(todo._id)}>
                            <div className={"w-5 h-5 mr-4 rounded-full bg-[#61759b] transition duration-400 " + (todo.complete ? " bg-[#D81E5B] bg-gradient-to-b from-[#D81E5B] to-[#8A4EFC]":"")}></div>
                            <div className={"text-base" + (todo.complete ? " line-through" : "")}>{todo.title}</div>
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
                                        setTodoTitle(todo.title)
                                        setTodoDescription(todo.description)
                                    }
                                }/>
                                
                                <ChevronDownIcon className="absolute top-1/2 right-20 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center" 
                                    onClick={(event) => {
                                        event.stopPropagation()
                                        const arrayToUpdate = [...toggleCollapse]
                                        arrayToUpdate[index] = !arrayToUpdate[index]
                                        setToggleCollapse(arrayToUpdate)
                                        console.log(toggleCollapse)
                                    }
                                }/>

                        </div>

                        {toggleCollapse[index] ? 
                            <div className="relative bg-[#131A26] p-4 rounded-2xl transition duration-500 mb-4 mt-1 hover:opacity-80">
                                <p className="mb-2 text-gray-400 dark:text-gray-400">{todo.description === ' ' ? 'No Description Available' : todo.description}</p>
                                {/* <p className="text-gray-500 dark:text-gray-400">Check out this guide to learn how to <a href="/docs/getting-started/introduction/" className="text-blue-600 dark:text-blue-500 hover:underline">get started</a> and start developing websites even faster with components on top of Tailwind CSS.</p> */}
                            </div> : ""
                        }
                    </div>
                )) } 
            </div>
            
            <div className="fixed bottom-8 left-8 flex items-center justify-center w-32 h-12 rounded-full text-base font-bold bg-gray-200 bg-gradient-to-br from-[#D81E5B] to-[#8A4EFC] cursor-pointer" onClick={() => signOut(true)}>Sign Out&nbsp;
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
import { useState, useEffect , Fragment } from "react"
import { useNavigate } from 'react-router-dom'
import { checkIfConnected, API_BASE } from '../utils/utils'
import { PlusCircleIcon, ArrowLeftCircleIcon, XCircleIcon, TrashIcon, PencilSquareIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import { MoonLoader } from "react-spinners"


const HomePage = () => {
    // Set the document title to 'Home'
    document.title = 'Home'
  
    // Get the navigate function from react-router-dom for navigation
    const navigate = useNavigate()
  
    // State variables to store the list of todos, todo title, todo description, and various UI flags
    const [todos, setTodos] = useState([])
    const [todoTitle, setTodoTitle] = useState("")
    const [todoDescription, setTodoDescription] = useState("")
    const [newPopupActive, setNewPopupActive] = useState(false)
    const [editPopUpActive, setEditPopupActive] = useState(false)
    const [todoToEdit, setTodoToEdit] = useState(undefined)
    const [toggleCollapse, setToggleCollapse] = useState([])
    const [loading, setLoading] = useState(true) // State for displaying loading component

  
    useEffect (() => {
      // Check network connection and user login status when the component mounts
      handleConnection()
      localStorage.setItem('first_login', false)
      GetTodos()
    }, [])
  
    const handleConnection = () => {
      // Check if the user is connected or if it's their first login
      // If not, navigate them to the login page
      const rememberMe = localStorage.getItem('remember_me')
      const first_login = localStorage.getItem('first_login')
  
      if (!checkIfConnected() || (rememberMe === 'false' && first_login === 'false')) {
        navigate("/")
      }
    }
  
    const GetTodos = async () => {
      setLoading(true)
      // Fetch the list of todos from the API and update the todos state
      const token = localStorage.token
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ token: token })
      }
  
      try {
        const response = await fetch(API_BASE + '/todos', requestOptions)
        
        if (response.status === 401) {
          // Clear local storage and navigate to the login page if the user is not authorized
          localStorage.clear()
          navigate('/')
        }
  
        if (response.ok) {
          // Parse the response data and update the todos and toggleCollapse states
          const data = await response.json()
          setTodos(data)
          setToggleCollapse(Array.from({ length: data.length }).fill(false))
        }
      } catch (error) {
        console.error("An error occurred while getting todos: ", error)
      }
      setLoading(false)
    }
  
    const completeTodo = async (id) => {
      // Mark a todo as complete by sending a PUT request to the API
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' }
      }
  
      // Fetch the updated todo data from the API and update the todos state
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
      // Delete a todo by sending a DELETE request to the API
      const requestOptions = {
        method: 'DELETE'
      }
  
      // Perform the deletion and then refresh the todos list
      await fetch(API_BASE + '/todo/delete/' + id, requestOptions)
      GetTodos()
    }
  
    const addTodo = async (title, description) => {
      // Add a new todo by sending a POST request to the API
      if (title === '') {
        // If the todo title is empty, return without adding it
        return
      }
  
      const requestOptions = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: localStorage.token, "title": title, "description": description === '' ? ' ' : description })
      }
  
      // Send the request, update the todos state, and reset input fields and UI flags
      const response = await fetch(API_BASE + '/todo/new/', requestOptions)
        .then(res => res.json())
        .catch('An error occurred while adding data.')
  
      setTodos([...todos, response])
      setNewPopupActive(false)
      setTodoTitle("")
      setTodoDescription("")
    }
  
    const editTodo = async (TodoObject) => {
      // Edit a todo by sending a PUT request to the API
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ title: todoTitle, description: todoDescription === '' ? " " : todoDescription })
      }
  
      // Send the request, refresh the todos list, and reset input fields, UI flags, and todoToEdit
      await fetch(API_BASE + `/todo/update/${TodoObject._id}`, requestOptions)
        .then(res => res.json())
  
      GetTodos()
  
      setEditPopupActive(false)
      setTodoToEdit(undefined)
      setTodoTitle("")
      setTodoDescription("")
    }
  
    const signOut = () => {
      // Clear local storage and navigate to the login page for user sign out
      localStorage.clear()
      navigate('/login')
    }

    const createPopupFragment = (popUpHeader, buttonText, buttonAction, exitOnClick) => {
        /**
         * Creates a popup fragment with a header, input fields for title and description, and a button.
         * The fragment is displayed in a fixed position in the center of the screen.
         *
         * @param {string} popUpHeader - The header text for the popup.
         * @param {string} buttonText - The text to be displayed on the button.
         * @param {function} buttonAction - The action to be executed when the button is clicked.
         * @param {function} exitOnClick - The action to be executed when the exit icon is clicked.
         * @returns {JSX.Element} - The JSX element representing the popup fragment.
         */
      
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
                    event.stopPropagation()
                    buttonAction()
                  }}
                > {buttonText} </button>
              </div>
            </div>
          </Fragment>
        )
      }
      
      const createNewPopUpFragment = () => {
        /**
         * Creates a popup fragment for adding a new task.
         * Calls the createPopupFragment function with specific parameters for the "Add Task" functionality.
         *
         * @returns {JSX.Element} - The JSX element representing the popup fragment for adding a new task.
         */
        return createPopupFragment('Add Task', 'Create Task', () => addTodo(todoTitle, todoDescription), setNewPopupActive)
      }
      
      const createEditPopUpFragment = () => {
        /**
         * Creates a popup fragment for editing a task.
         * Calls the createPopupFragment function with specific parameters for the "Edit Task" functionality.
         *
         * @returns {JSX.Element} - The JSX element representing the popup fragment for editing a task.
         */
        return createPopupFragment('Edit Task', 'Update Task', () => editTodo(todoToEdit), setEditPopupActive)
      }

    
    return (
      <div className="p-8">
            {/* Welcome message */}
            <h1 className="text-4xl font-bold mb-8">Welcome, {`${localStorage.first_name}`} </h1>
            
            {/* Section title */}
            <div className="flex justify-between">
                <h4 className="order-1 text-base text-[#61759b] uppercase font-normal">Your tasks</h4>
            </div>

            {loading ? <div className="pt-16 flex flex-col items-center"> <MoonLoader size={50} color={'#8A4EFC'} loading={loading} css={"padding: 100px; margin: auto; width: 50%; border: 3px solid green;padding: 10px;"} />  <p className="pt-1">Loading tasks</p> </div> : 

            <div>
                { todos.map((todo, index) => ( 
                    <div key={todo._id}>
                        {/* Todo item */}
                        <div className="relative bg-[#131A26] p-4 rounded-2xl flex items-center transition duration-500 cursor-pointer mt-4 hover:opacity-80" onClick={() => completeTodo(todo._id)}>
                            {/* Todo status indicator */}
                            <div className={"w-5 h-5 mr-4 rounded-full bg-[#61759b] transition duration-400 " + (todo.complete ? " bg-[#D81E5B] bg-gradient-to-b from-[#D81E5B] to-[#8A4EFC]":"")}></div>
                            {/* Todo title */}
                            <div className={"text-base" + (todo.complete ? " line-through" : "")}>{todo.title}</div>
                                
                                {/* Delete Todo button */}
                                <TrashIcon className="fill-[#D81E5B] absolute top-1/2 right-4 transform -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center" 
                                    onClick={(event) => {
                                        event.stopPropagation()
                                        deleteTodo(todo._id)
                                    }
                                }/>

                                {/* Edit Todo button */}
                                <PencilSquareIcon className="absolute top-1/2 right-12 transform -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center" 
                                    onClick={(event) => {
                                        event.stopPropagation()
                                        setEditPopupActive(true)
                                        setTodoToEdit(todo)
                                        setTodoTitle(todo.title)
                                        setTodoDescription(todo.description === ' ' ? '' : todo.description)
                                    }
                                }/>
                                
                                {/* Toggle description visibility button */}
                                <ChevronDownIcon className="absolute top-1/2 right-20 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center" 
                                    onClick={(event) => {
                                        event.stopPropagation()
                                        const arrayToUpdate = [...toggleCollapse]
                                        arrayToUpdate[index] = !arrayToUpdate[index]
                                        setToggleCollapse(arrayToUpdate)
                                    }
                                }/>

                        </div>
                        
                        {/* Description */}
                        {toggleCollapse[index] ? 
                            <div className="relative bg-[#131A26] p-4 rounded-2xl transition duration-500 mb-4 mt-1 hover:opacity-80">
                                <p style={{whiteSpace: "pre-line"}} className="mb-2 text-gray-400 dark:text-gray-400">{todo.description === ' ' ? 'No Description Available' : todo.description}</p>
                            </div> : ""
                        }
                    </div>
                )) } 
            </div>
            }     
            
            {/* Sign Out button */}
            <div className="fixed bottom-8 left-8 flex items-center justify-center w-32 h-12 rounded-full text-base font-bold bg-gray-200 bg-gradient-to-br from-[#D81E5B] to-[#8A4EFC] cursor-pointer" onClick={() => signOut(true)}>Sign Out&nbsp;
                <ArrowLeftCircleIcon className="h-6 w-6"/> 
            </div>
            
            {/* Add Task button */}
            <div className="fixed bottom-8 right-8 flex items-center justify-center w-32 h-12 rounded-full text-base font-bold text-gray-200 bg-gradient-to-br from-[#D81E5B] to-[#8A4EFC] cursor-pointer" onClick={() => setNewPopupActive(true)}>
                Add Task&nbsp;
                <PlusCircleIcon className="h-6 w-6"/>
            </div>
            
            {/* Render new task popup if active */}
            {newPopupActive ? createNewPopUpFragment() : ""}

            {/* Render edit task popup if active */}
            {editPopUpActive ? createEditPopUpFragment() : ""}
            
      </div>
    )
}

export default HomePage
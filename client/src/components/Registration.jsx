import React, { useState, useEffect } from "react"
import backgroundImage from '../assets/geometric_background.jpg'
import { useNavigate, Link } from 'react-router-dom'
import { API_BASE } from "../utils/utils"
import { MoonLoader } from "react-spinners"

/**
 * The RegistrationPage component represents the registration page of the application.
 * Users can enter their details (first name, last name, email, and password) to create a new account.
 */
const RegistrationPage = () => {
  document.title = 'Sign Up' // Sets the title of the page to "Sign Up"
  const navigate = useNavigate() // Navigation hook from react-router-dom

  // Hooks for managing state
  const [email, setEmail] = useState("") // State for the email input field
  const [password, setPassword] = useState("") // State for the password input field
  const [verifyPassword, setVerifyPassword] = useState("") // State for the verify password input field
  const [firstName, setFirstName] = useState("") // State for the first name input field
  const [lastName, setLastName] = useState("") // State for the last name input field
  const [registrationError, setRegistrationError] = useState("") // State for displaying login errors
  const [loading, setLoading] = useState(false) // State for displaying loading component

  // useEffect runs the code after the component is rendered
  useEffect(() => {
    ClearLocalStorage()

  }, [])

  /**
   * Clears the local storage.
   */
  const ClearLocalStorage = () => {
    localStorage.clear()
  }

  /**
   * Handles the form submission when the user clicks the "Sign up" button.
   * Sends a POST request to the server to create a new user account.
   */
  const handleSubmit = async (event) => {
    setLoading(true)
    event.preventDefault() // Prevents the default form submission behavior

    let data = {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName
    }

    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }

    try {
      const response = await fetch(API_BASE + '/user/new', requestOptions)
      
      if (response.ok) {
        navigate('/login') // Redirects the user to the login page
      } else {
        switch(response.status) {
          case 401:
            setRegistrationError('Email already exist in the system')
            break
          default:
            setRegistrationError('Unexpected error has occured')
        }
      }
    } catch (error) {
      setRegistrationError('Wrong Registration Details')
    } finally {
      setLoading(false)
    }

  }

  return (
    <div className="bg-cover bg-no-repeat bg-center h-screen flex items-center justify-center" style={{ backgroundImage: `url(${backgroundImage})` }}>

    {/* if we are witing for response from server after submitting form - display loading widget else display the page */}
    { loading ? <div> <MoonLoader size={50} color={'##8A4EFC'} loading={loading} /> <p className="pt-1">Signing Up</p> </div>:

      <div className="flex flex-col justify-center w-screen h-screen ">
        <form className="max-w-[400px] bg-gray-800 w-full mx-auto p=8 px-8 py-4 rounded-lg" onSubmit={handleSubmit}>
           <h2 className="text-4xl dark:text-white font-bold text-center">Sign Up</h2>

           <div className="flex flex-col text-gray-400 py-2">
             <label>First Name</label>
             <input
               className="rounded-lg bg-gray-500 mt-1 p-2 focus:border-purple-600 focus:bg-gray-800 focus:outline-none"
               type="text"
               name="first_name"
               onChange={(e) => { setFirstName(e.target.value) }}
               value={firstName}
               required
             />
           </div>

           <div className="flex flex-col text-gray-400 py-2">
             <label>Last Name</label>
             <input
               className="rounded-lg bg-gray-500 mt-1 p-2 focus:border-purple-600 focus:bg-gray-800 focus:outline-none"
               type="text"
               name="last_name"
               onChange={(e) => { setLastName(e.target.value) }}
               value={lastName}
               required
             />
           </div>

           <div className="flex flex-col text-gray-400 py-2">
             <label>Email</label>
             <input
               className="rounded-lg bg-gray-500 mt-1 p-2 focus:border-purple-600 focus:bg-gray-800 focus:outline-none"
               type="email"
               name="email"
               onChange={(e) => { setEmail(e.target.value) }}
               value={email}
               required
             />
           </div>

           <div className="flex flex-col text-gray-400 py-2">
             <label>Password</label>
             <input
               className="rounded-lg bg-gray-500 mt-1 p-2 focus:border-purple-600 focus:bg-gray-800 focus:outline-none"
               type="password"
               placeholder="********"
               name="password"
               onChange={(e) => { setPassword(e.target.value) }}
               value={password}
               required
             />
           </div>

           <div className="flex flex-col text-gray-400 py-2">
             <label>Verify Password</label>
             <input
               className="rounded-lg bg-gray-500 mt-1 p-2 focus:border-purple-600 focus:bg-gray-800 focus:outline-none"
               type="password"
               placeholder="********"
               name="password"
               onChange={(e) => { 
                 setVerifyPassword(e.target.value) 
                 if (password === e.target.value) {
                   setRegistrationError("")
                 } else { 
                 setRegistrationError("Passwords do not match")
                 }
               }}
              
               value={verifyPassword}
               required
             />
           </div>
          
           {registrationError && <div className="bg-red-600 w-3/4 h-6 2 pt-1 rounded-md text-xs flex justify-center relative left-10 mt-2"> {registrationError} </div>}

           <div>
             <button
               type="submit"
               className="bg-gradient-to-r from-purple-800 to-purple-300 w-full py-2 my-2 rounded-xl font-semibold hover:bg-gradient-to-r hover:from-purple-1000 hover:to-purple-500 mt-4"
             >
               Sign up
             </button>

             <p className="mt-1 relative left-4">Already have a user? Please sign in{' '}<Link to="/login" style={{ color: 'blue', textDecoration: 'underline' }}>here</Link></p>
           </div>
         </form>
       </div>
    }
    </div>
  )
}

export default RegistrationPage

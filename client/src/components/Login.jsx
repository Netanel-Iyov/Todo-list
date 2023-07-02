import React, { useState, useLayoutEffect } from "react"
import backgroundImage from '../assets/geometric_background.jpg'
import { useNavigate } from 'react-router-dom'
import { API_BASE, checkIfConnected } from "../utils/utils"

/**
 * The LoginPage component represents the login page of the application.
 * Users can enter their email and password to log in.
 */
const LoginPage = () => {
  document.title = 'Login' // Sets the title of the page to "Login"
  const navigate = useNavigate() // Navigation hook from react-router-dom

  // useLayoutEffect runs the code before the render() function is called 
  useLayoutEffect(() => {
    handleConnection()
  }, [])

  const [email, setEmail] = useState("") // State for the email input field
  const [password, setPassword] = useState("") // State for the password input field
  const [rememberMe, setRememberMe] = useState(true) // State for the "Remember Me" checkbox
  const [loginError, setLoginError] = useState("") // State for displaying login errors

  /**
   * Checks if the user is already logged in and has chosen to be remembered.
   * If so, it automatically redirects the user to the home page.
   */
  const handleConnection = () => {
    if (checkIfConnected() && localStorage.getItem('remember_me') === 'true') {
      navigate('/home')
    }
  }

  /**
   * Handles the form submission when the user clicks the "Sign In" button.
   * Sends a POST request to the server to authenticate the user.
   */
  const handleSubmit = async (event) => {
    event.preventDefault() // Prevents the default form submission behavior

    let data = {
      email: email,
      password: password
    }

    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    }

    const response = await fetch(API_BASE + '/user/login', requestOptions)
    const responseData = await response.json()

    if (!responseData.token) {
      setLoginError('* Wrong Login Details')
    } else {
      // Save the token and name in the local Storage
      localStorage.setItem('token', responseData.token)
      localStorage.setItem('first_name', responseData.first_name)
      localStorage.setItem('remember_me', rememberMe)
      localStorage.setItem('first_login', true)

      navigate('/home') // Redirects the user to the home page
    }
  }

  /**
   * Handles the sign-up button click.
   * Redirects the user to the registration page.
   */
  const handleSignUp = () => {
    navigate('/registration')
  }
  
  return (
    <div className="bg-cover bg-no-repeat bg-center h-screen flex items-center justify-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="flex flex-col justify-center w-screen h-screen ">
        <form className="max-w-[400px] bg-gray-800 w-full mx-auto p=8 px-8 py-4 rounded-lg" onSubmit={handleSubmit}>
          <h2 className="text-4xl dark:text-white font-bold text-center">Sign In</h2>
          
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
          
          <div className="flex justify-between text-gray-400 py-2">
            <p>
              <input
                type="checkbox"
                defaultChecked={true}
                onChange={(e) => {setRememberMe(!e.target.value)}}
                value={rememberMe}
                className="mr-1 text-purple-600 border-purple-600"
              />
              Remember Me
            </p>
          </div>
          
          {loginError && <p className="text-center text-purple-500 mt-2">{loginError}</p>}

          <div>
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-800 to-purple-300 w-full py-2 my-2 rounded-xl font-semibold hover:bg-gradient-to-r hover:from-purple-1000 hover:to-purple-500 mt-8"
            >
              Sign In
            </button>
            <button
              onClick={handleSignUp}
              className="bg-gradient-to-r from-purple-800 to-purple-300 w-full py-2 my-2 rounded-xl font-semibold hover:bg-gradient-to-r hover:from-purple-1000 hover:to-purple-500"
            >
              Sign up
            </button>
          </div>  
        </form>
      </div>
    </div>
  )
}

export default LoginPage

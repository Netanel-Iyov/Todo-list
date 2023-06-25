import React, {useState, useLayoutEffect} from "react"
import backgroundImage from '../assets/geometric_background.jpg';
import { useNavigate } from 'react-router-dom';
import { checkIfConnected } from '../utils/utils'


const API_BASE = "https://todo-list-api-alpha.vercel.app"
// const API_BASE = "http://127.0.0.1:3001"

const LoginPage = () => {
    document.title = 'Login';
    const navigate = useNavigate();

    // hooks
    // useLayoutEffect runs the code before the render() function is called 
    useLayoutEffect (() => {
        handleConnection();
    }, [])

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(true)
    const [loginError, setLoginError] = useState("")

    const handleConnection = () => {
        if (checkIfConnected()) {
           navigate('/home') 
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
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

            navigate('/home')
        }
    }   
    
    const handleSignUp = () => {
        navigate('/registration'); 
      };
      
    return (
        <div className="bg-cover bg-no-repeat bg-center h-screen flex items-center justify-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="flex flex-col justify-center w-screen h-screen ">
                <form className="max-w-[400px] bg-gray-800 w-full mx-auto p=8 px-8 py-4 rounded-lg" onSubmit={handleSubmit}>
                    <h2 className="text-4xl dark:text-white font-bold text-center">Sign In</h2>
                    
                    <div className="flex flex-col text-gray-400 py-2">
                        <label>Email</label>
                        <input className="rounded-lg bg-gray-500 mt-1 p-2 focus:border-purple-600 focus:bg-gray-800 focus:outline-none" type="email" name="email" 
                        onChange={ (e) => { setEmail(e.target.value) }} value={email} required/>
                    </div>
                    
                    <div className="flex flex-col text-gray-400 py-2">
                        <label>Password</label>
                        <input className="rounded-lg bg-gray-500 mt-1 p-2 focus:border-purple-600 focus:bg-gray-800 focus:outline-none" type="password" placeholder="********" name="password"
                        onChange={ (e) => { setPassword(e.target.value) }} value={password} required/>
                    </div>
                    
                    <div className="flex justify-between text-gray-400 py-2">
                        <p><input type="checkbox" defaultChecked={true} onChange={ (e) => {setRememberMe(!e.target.value)}} value={rememberMe} className="mr-1 text-purple-600 border-purple-600"></input>Remember Me</p>
                        <p>Forgot Password</p>
                    </div>
                    
                    {loginError && <p className="text-center text-purple-500 mt-2">{loginError}</p>}

                    <div>
                        <button type="submit" className="bg-gradient-to-r from-purple-800 to-purple-300 w-full py-2 my-2 rounded-xl font-semibold hover:bg-gradient-to-r hover:from-purple-1000 hover:to-purple-500 mt-8">Sign In</button>
                        <button onClick={handleSignUp} className="bg-gradient-to-r from-purple-800 to-purple-300 w-full py-2 my-2 rounded-xl font-semibold hover:bg-gradient-to-r hover:from-purple-1000 hover:to-purple-500">Sign up</button>
                    </div>  
                </form>
            </div>
        </div>
        )
}

export default LoginPage;
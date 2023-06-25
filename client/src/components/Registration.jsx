import React, {useState, useEffect} from "react"
import backgroundImage from '../assets/geometric_background.jpg';
import { useNavigate } from 'react-router-dom';


const API_BASE = "https://todo-list-api-alpha.vercel.app"
// const API_BASE = "http://127.0.0.1:3001"


const RegistrationPage = () => {
    document.title = 'Sign Up';
    const navigate = useNavigate();

    // hooks
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [loginError, setLoginError] = useState("")
    
    useEffect (() => {
        ClearLocalStorage();
    }, [])

    const ClearLocalStorage = () => {
        localStorage.clear();
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        let data = {email: email,
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
                const data = await response.json()
                navigate('/login')
            }
            else { 
                setLoginError('* Wrong Registration Details')
            }
        } catch (error) {
            setLoginError('* Wrong Registration Details')
        }
    }

    
    
    return (
        <div className="bg-cover bg-no-repeat bg-center h-screen flex items-center justify-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="flex flex-col justify-center w-screen h-screen ">
                <form className="max-w-[400px] bg-gray-800 w-full mx-auto p=8 px-8 py-4 rounded-lg" onSubmit={handleSubmit}>
                    <h2 className="text-4xl dark:text-white font-bold text-center">Sign Up</h2>
                    
                    <div className="flex flex-col text-gray-400 py-2">
                        <label>First Name</label>
                        <input className="rounded-lg bg-gray-500 mt-1 p-2 focus:border-purple-600 focus:bg-gray-800 focus:outline-none" type="text" name="first_name"
                        onChange={ (e) => { setFirstName(e.target.value) }} value={firstName} required/>
                    </div>

                    <div className="flex flex-col text-gray-400 py-2">
                        <label>Last Name</label>
                        <input className="rounded-lg bg-gray-500 mt-1 p-2 focus:border-purple-600 focus:bg-gray-800 focus:outline-none" type="text" name="last_name"
                        onChange={ (e) => { setLastName(e.target.value) }} value={lastName} required/>
                    </div>

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
                    
                    {loginError && <p className="text-center text-purple-500 mt-2">{loginError}</p>}

                    <div>
                        <button type="submit" className="bg-gradient-to-r from-purple-800 to-purple-300 w-full py-2 my-2 rounded-xl font-semibold hover:bg-gradient-to-r hover:from-purple-1000 hover:to-purple-500 mt-8">Sign up</button>
                    </div>  
                </form>
            </div>
        </div>
        )
    }

export default RegistrationPage;
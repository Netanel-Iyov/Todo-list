import React, {useState} from "react"


const LoginPage = () => {
    const {email, setEmail} = useState("")
    const {password, setPAssword} = useState("")

    const LoginClick = (email, password) => {
        // Verify with the mongo database that the user is valid 
        // Raise error if not
        // Route to HomaPage if it is 
        
        
    }
    
    return (
        <form>
            <label for="email">Email</label>
            <input type="email" placeholder="my-email-account@gmail.com" name="email"/>
            <label for="password">Password</label>
            <input type="password" placeholder="********" name="password"/>
            <button onClick={}>Login</button>
            <button>Sign up</button>
        </form>
        )
}

export default LoginPage
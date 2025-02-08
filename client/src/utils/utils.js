export const API_BASE = process.env.REACT_APP_API_BASE
// utility function to check if a user is already connected

const b = 'b'

export const checkIfConnected = () => {
    const token = localStorage.getItem('token')
    const first_name = localStorage.getItem('first_name')

    if (token === null || token === 'undefinded' || first_name === 'undefined' || first_name === null ) {
        return false
    }
    
    return true
}

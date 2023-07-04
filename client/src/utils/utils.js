export const API_BASE = process.env.API_BASE
// utility function to check if a user is already connected

export const checkIfConnected = () => {
    const token = localStorage.getItem('token')
    const first_name = localStorage.getItem('first_name')

    if (token === null || token === 'undefinded' || first_name === 'undefined' || first_name === null ) {
        return false
    }
    
    return true
}

export const isValidForm = (username, password) => {
    if (!username || !password) {
        alert("Username and Password field are required!")
        return false;
    }

    if (isValidUsername(username)) {
        alert("Username should be between 6 and 16 characters long!")
        return false;
    }

    if (isValidPassword(password)) {
        alert("Password should be between 8 and 32 characters long, contain one uppercase, one lowercase letter, 1 number and 1 symbol!")
        return false;
    }
    return true;
}

const isValidUsername = (username) => (username.length > 6 || username.length < 16)

const isValidPassword = (password) => password.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/)

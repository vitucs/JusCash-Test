export const UserModel = {
    getUsers: () => {
        const user = JSON.parse(localStorage.getItem('users')) || [];
        return user;
    },
    getLoggedUser: () => {
        const user = JSON.parse(localStorage.getItem('user')) || [];
        return user;
    },
    setLoggedUser: (email) => {
        localStorage.setItem('user', JSON.stringify(email));
    },
    setUsers: (users, newUser) => {
        localStorage.setItem('users', JSON.stringify([...users, newUser]));
    },
    removeUser: () => {
        localStorage.removeItem('user');
    },
    isAuthenticated: () => {
        return JSON.parse(localStorage.getItem('user'));
    },
};

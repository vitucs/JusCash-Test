import { toast } from 'react-toastify';
import { UserModel } from '../models/UserModel';

export const AuthController = {
    login: (email, password) => {
        const users = UserModel.getUsers();
        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
            UserModel.setLoggedUser(email);
            toast.success('Login realizado com sucesso');

            return email;
        } else {
            toast.error('Credenciais inválidas');
        }
    },
    logout: () => {
        UserModel.removeUser();
    },
    isAuthenticated: () => {
        return UserModel.isAuthenticated();
    },
    signup: (name, email, password, passwordConfirm) => {
        const minLength = 8;
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
        const hasNumericChar = /[0-9]/;
        const hasAlphanumericChar = /[a-zA-Z]/;
        var passwordError = null;

        if (password.length < minLength) {
             passwordError = 'A senha deve ter pelo menos 8 caracteres.';
        }
        if (!hasSpecialChar.test(password)) {
             passwordError = 'A senha deve conter pelo menos um caractere especial.';
        }
        if (!hasNumericChar.test(password)) {
             passwordError = 'A senha deve conter pelo menos um caractere numérico.';
        }
        if (!hasAlphanumericChar.test(password)) {
             passwordError = 'A senha deve conter pelo menos um caractere alfanumérico.';
        }
        
        if (passwordError) {
            toast.error(passwordError);
            return;
        }

        const users = UserModel.getUsers();
        const userExists = users.some(user => user.email === email);

        if (userExists) {
            toast.error('Nome de usuário já existe');
        } else if (password !== passwordConfirm) {
            toast.error('As senhas não são iguais');
        } else {
            const newUser = { name, email, password };
            UserModel.setUsers(users, newUser);
            UserModel.setLoggedUser(email);
            toast.success('Usuário criado com sucesso');
            return email;
        }
    }
};

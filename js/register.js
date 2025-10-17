//funcionamiento del formulario de regristro
const Register = document.getElementById('formRegister');

Register.addEventListener('submit', (e) => {
    e.preventDefault();

    const user = document.getElementById('user').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const isUserRegistred = users.find(u => u.email === email);
    
    if(isUserRegistred){
        return Swal.fire({
            icon: "error",
            text: "Este usuario ya esta registrado"
        });
    }
    
    if (user === "" || password === "" || email === ""){ 
        return Swal.fire({
            icon: "error",
            title: "No se completo el registro",
            text: "Debe completar todos los campos"
        }); 
    }
    
    users.push({user: user, email: email, password: password});
    localStorage.setItem('users', JSON.stringify(users));
    
    Swal.fire({
        icon: "success",
        title: "Bien!!!",
        text: "Su usuario a sido registrado"
    });
    location.href = "login.html";  
});
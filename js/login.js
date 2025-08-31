function showAlertError() {
    document.getElementById("alert-danger").classList.add("show");
}


let boton = document.getElementById('boton');

boton.addEventListener("click", function () {
    
    let usuario = document.getElementById('user').value.trim();
    let password = document.getElementById('password').value.trim();

    localStorage.setItem("sesionIniciada", "true");
    localStorage.setItem("usuario",usuario);
    localStorage.setItem("password",password);
    
    
    if (usuario === "" || password === ""){ 
        showAlertError();
        return;
    }
   
    location.href = "index.html";  
})

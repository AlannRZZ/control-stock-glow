const usuarios = [
    { usuario: "jairo", contrasena: "piayjuana" },
    { usuario: "lean", contrasena: "toxic12" }
];

document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const user = document.getElementById("usuario").value;
    const pass = document.getElementById("contrasena").value;
    const mensaje = document.getElementById("mensajeError");

    const encontrado = usuarios.find(u => u.usuario === user && u.contrasena === pass);

    if (encontrado) {
        localStorage.setItem("logueado", "true");
        window.location.href = "inicio.html";
    } else {
        mensaje.textContent = "Usuario o contraseña incorrectos.";
    }
});

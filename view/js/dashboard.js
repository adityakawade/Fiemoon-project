const logout = () => {
    localStorage.clear();
    location.href = "/login";
}

window.onload = () => {
    showUserDeatails();
}

const showUserDeatails = async () => {
    const session = await getsession();
    

    const fullname = document.getElementById("fullname");
    const email = document.getElementById("email");
    fullname.innerHTML = session.fullname;
    email.innerHTML = session.email;
}
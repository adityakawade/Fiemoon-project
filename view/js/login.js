const toast = new Notyf({
    position: { x: 'center', y: 'top' }
});

const login = async (e) => {
    try {
        e.preventDefault();
        const form = e.target;
        const element = form.elements;
        const payload = {
            email: element.email.value,
            password: element.password.value,
        }
        const response = await axios.post("http://localhost:8080/login", payload);
        toast.success(response.data.message);
        localStorage.setItem("authtoken", response.data.token)
        setTimeout(() => {
            location.href = "app/dashboard.html"
        }, 2000)

    } catch (err) {
        toast.error(err.response ? err.response.data.message : err.message);
    }
}
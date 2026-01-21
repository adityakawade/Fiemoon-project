axios.defaults.baseURL = SERVER

const toast = new Notyf({
    position: { x: 'center', y: 'top' }
});

const checksession = async () => {
    const session = await getsession();
    console.log(session);
    if (session) {
        location.href = "/dashboard";
    }

}

checksession()

const login = async (e) => {
    try {
        e.preventDefault();
        const form = e.target;
        const element = form.elements;
        const payload = {
            email: element.email.value,
            password: element.password.value,
        }
        const response = await axios.post("/api/login", payload);
        toast.success(response.data.message);
        localStorage.setItem("authtoken", response.data.token)
        setTimeout(() => {
            location.href = "/dashboard"
        }, 2000)

    } catch (err) {
        toast.error(err.response ? err.response.data.message : err.message);
    }
}
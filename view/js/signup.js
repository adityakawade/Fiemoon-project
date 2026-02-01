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

checksession();

const signup = async (e) => {
    try {
        e.preventDefault();
        const form = e.target;
        const element = form.elements;
        console.log(element);

        const payload = {
            fullname: element.fullname.value,
            mobile: element.mobile.value,
            email: element.email.value,
            password: element.password.value,
        }

        const response = await axios.post("/api/signup", payload);
        console.log(response);

        form.reset();
        toast.success(response.data.message);
        setTimeout(() => {
            location.href = "/login"
        }, 2000)

    } catch (err) {

        toast.error(err.response ? err.response.data.message : err.message);


    }
}
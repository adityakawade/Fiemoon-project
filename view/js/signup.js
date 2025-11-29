const toast = new Notyf({
    position: { x: 'center', y: 'top' }
});

const checksession = async () => {
    const session = await getsession();
    console.log(session);
    if (session) {
        location.href = "app/dashboard.html";
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

        const response = await axios.post("http://localhost:8080/signup", payload);
        console.log(response);

        form.reset();
        toast.success(response.data.message);
        setTimeout(() => {
            location.href = "index.html"
        }, 2000)

    } catch (err) {

        toast.error(err.response ? err.response.data.message : err.message);


    }
}
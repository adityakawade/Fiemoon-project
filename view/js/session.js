axios.defaults.baseURL = SERVER

const getsession = async () => {
    try {
        const session = localStorage.getItem("authtoken");

        if (!session) {
            return null;
        }

        const payload = {
            token: session
        }

        const response = await axios.post("/api/token/verify", payload);
        return response.data;

    } catch (error) {
        return null
    }

}


const logout = () => {
    localStorage.clear();
    location.href = "/login";
}
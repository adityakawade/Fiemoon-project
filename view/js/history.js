axios.defaults.baseURL = SERVER

const logout = () => {
    localStorage.clear();
    location.href = "/login";
}

const toast = new Notyf({
    position: { x: 'center', y: 'top' }
});

const getAuthToken = () => {
    const option = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("authtoken")}`
        }
    }
    return option
}

window.onload = () => {
    fetchedHistory();
    showUserDeatails();
    fetchImage();
    protectPage();
}

const showUserDeatails = async () => {
    const session = await getsession();


    const fullname = document.getElementById("fullname");
    const email = document.getElementById("email");
    fullname.innerHTML = session.fullname;
    email.innerHTML = session.email;
}


const fetchedHistory = async () => {
    try {
        const { data } = await axios.get("/api/share", getAuthToken());
        const table = document.getElementById("history-tables");
        const notFoundUi = `
        <div class="p-16 text-center">
        <h1 class="text-gray-500 text-3xl">Oops ! You have not shared any file yet</h1>
        </div>`

        if (data.length === 0) {
            table.innerHTML = notFoundUi;
            return
        }
        for (const item of data) {
            const ui = `  <tr class="text-gray-500 border-b border-gray-100">
                            <td class="py-4 pl-6 capitalize">${item.file.filename}</td>
                            <td>${item.receiverEmail}</td>
                            <td> ${moment(item.createdAt).format('DD MMM YYYY,   hh:mm A')}</td>
            </tr>`
            table.innerHTML += ui;
        }

    } catch (error) {
        toast.error(error.response ? error.response.data.message : error.message);
    }
}






const uploadImage = () => {
    try {
        const input = document.createElement("input")
        const pic = document.getElementById("pic");
        input.type = "file";
        input.accept = "image/*"
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            const formData = new FormData();
            formData.append('picture', file);
            await axios.post("/api/profile-picture", formData, getAuthToken());
            const url = URL.createObjectURL(file)
            pic.src = url;


        }
    } catch (error) {
        toast.error(error.response ? error.response.data.message : error.message)
    }
}

const fetchImage = async () => {
    try {
        const option = {
            responseType: 'blob',
            ...getAuthToken()
        }
        const { data } = await axios.get("/api/profile-picture", option);
        const url = URL.createObjectURL(data);
        const pic = document.getElementById("pic");
        pic.src = url
    } catch (error) {
        if (!error.response) {
            return toast.error(error.message);
        }

        const err = await (error.response.data).text();
        const { message } = JSON.parse(err);
        toast.error(message)
    }
}




const protectPage = async () => {
    const session = await getsession();  // your existing function

    if (!session) {
        // No valid token → go back to login
        location.href = "/login";
    }
}
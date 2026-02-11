axios.defaults.baseURL = SERVER

const logout = () => {
    localStorage.clear();
    location.href = "/login";
}

window.onload = () => {
    showUserDeatails();
    fetchedRecentFiles();
    fetchedRecentShared();
    fetchedFilesReport();
    fetchImage();
    protectPage();
}
const toast = new Notyf({
    position: { x: 'center', y: 'top' }
});


const getSize = (size) => {
    const kb = size / 1000;
    const mb = kb / 1000;
    const gb = mb / 1000;

    if (gb >= 1) {
        return gb.toFixed(2) + ' Gb';
    }
    if (mb >= 1) {
        return mb.toFixed(2) + ' Mb';
    }
    if (kb >= 1) {
        return kb.toFixed(2) + ' Kb';
    }

    return size + ' B'
}

const getAuthToken = () => {
    const option = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("authtoken")}`
        }
    }
    return option
}
const showUserDeatails = async () => {
    const session = await getsession();


    const fullname = document.getElementById("fullname");
    const email = document.getElementById("email");
    fullname.innerHTML = session.fullname;
    email.innerHTML = session.email;
}


const fetchedRecentFiles = async () => {
    try {
        const { data } = await axios.get("/api/file?limit=3", getAuthToken());
        const recentFileBox = document.getElementById("recent-file-box");
        if (data.length === 0) {
            recentFileBox.innerHTML = `
                            <div class="flex flex-col items-center  p-6 text-center">
                                    <div class="mb-4 text-5xl">📁</div>
                                        <h1 class="text-gray-700 text-lg font-semibold">No files yet</h1>
                                        <p class="text-gray-500 text-sm mt-1">
                                             Upload your first file to see it here.
                                        </p>
                                        <button onclick="location.href='/files'"
                                                class="mt-5 px-4 py-2 bg-indigo-500 text-white text-sm rounded hover:bg-indigo-600">
                                                Upload File
                                        </button>
                            </div>
`
        }

        for (const item of data) {
            const ui = `
                            <div class="flex justify-between items-start">
                                <div class="">
                                    <h1 class="font-medium text-zinc-500 capitalize">${item.filename}</h1>
                                    <small class="text-gray-500 text-sm ">${getSize(item.size)}</small>
                                </div>
                                <p class="text-gray-600 text-sm ">${moment(item.createdAt).format('DD MMM YYYY,hh:mm A')}</p>
                            </div>`

            recentFileBox.innerHTML += ui
        }

    } catch (error) {
        toast.error(error.response ? error.response.data.message : error.message)
    }
}

const fetchedRecentShared = async () => {

    try {
        const { data } = await axios.get("/api/share?limit=3", getAuthToken());
        const recentShareBox = document.getElementById("recent-share-box");
        if (data.length === 0) {
            recentShareBox.innerHTML = `       
                    <div class="flex flex-col items-center p-6 text-center">
                           <div class="mb-4 text-5xl">📤</div>
                           <h1 class="text-gray-700 text-lg font-semibold">Nothing shared yet</h1>
                           <p class="text-gray-500 text-sm mt-1">
                                    Share a file and your history will appear here.
                           </p>
                             <button onclick="location.href='/files'"
                                                class="mt-5 px-4 py-2 bg-indigo-500 text-white text-sm rounded hover:bg-indigo-600">
                                                Upload File For Share Or Share
                                        </button>
                    </div>

            `
            return
        }
        for (const item of data) {
            const filename = item.file ? item.file.filename : "File deleted";
            const ui = `
                            <div class="flex justify-between items-start">
                                <div class="">
                                    <h1 class="font-medium text-zinc-500 capitalize">${filename}</h1>
                                    <small class="text-gray-500 text-sm ">${item.receiverEmail}</small>
                                </div>
                                <p class="text-gray-600 text-sm ">${moment(item.createdAt).format('DD MMM YYYY,hh:mm A')}</p>
                            </div>`

            recentShareBox.innerHTML += ui
        }
    } catch (error) {
        toast.error(error.response ? error.response.data.message : error.message)
    }
}

const getIconAndStyle = (type) => {
    const mainType = type.split("/")[0]; // "image", "video", "audio", "application"

    switch (mainType) {
        case "image":
            return {
                icon: "ri-file-image-line",
                bg: "linear-gradient(60deg, #64b3f4 0%, #c2e59c 100%)"
            }
        case "text":
            return {
                icon: "ri-file-text-line",
                bg: "linear-gradient(to right, #43cea2 0%, #185a9d 100%)"
            }
        case "video":
            return {
                icon: "ri-live-line",
                bg: "linear-gradient(to right, #b8cbb8 0%, #b465da 0%, #cf6cc9 33%, #ee609c 100%)"
            }
        case "audio":
            return {
                icon: "ri-folder-music-line",
                bg: "linear-gradient(to right, #6a11cb 0%, #2575fc 100%)"
            }
        case "application": // usually PDFs
            return {
                icon: "ri-file-pdf-2-line",
                bg: "linear-gradient(to right, #f83600 0%, #f9d423 100%)"
            };
        default:
            return {
                icon: "ri-file-line",
                bg: "linear-gradient(to right, #bdc3c7 0%, #2c3e50 100%)"
            }
    }
};


const fetchedFilesReport = async () => {
    try {
        const { data } = await axios.get("/api/dashboard", getAuthToken());
        const reportCard = document.getElementById("report-card");
        reportCard.innerHTML = ""
        // console.log(data);

        for (const item of data) {
            const { icon, bg } = getIconAndStyle(item._id);
            const ui = `<div
                        class="bg-white rounded-lg shadow hover:shadow-lg h-40 flex justify-center items-center flex-col relative overflow-hidden ">
                        <h1 class="text-xl font-semibold text-gray-600">${item._id.split("/")[0]}</h1>
                        <p class="text-4xl font-bold">${item.total}</p>
                        <div class=" w-[100px] h-[100px] rounded-full absolute top-7 -left-4 flex justify-center items-center"
                            style="background-image: ${bg}">
                            <i class="${icon} text-4xl text-white"></i>
                        </div>
                    </div>`
            reportCard.innerHTML += ui
        }

    } catch (error) {
        toast.error(error.response ? error.response.data.message : error.message)
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
        const res = await axios.get("/api/profile-picture", option);
        const data = res.data
        if (!data || data.size === 0 || res.status === 204) {
            const pic = document.getElementById("pic");
            pic.src = "../images/avt.png"
            return
        }
        const url = URL.createObjectURL(data);
        const pic = document.getElementById("pic");
        pic.src = url
    } catch (error) {
        const pic = document.getElementById("pic");
        pic.src = "/images/avt.png";
    }
}



const protectPage = async () => {
    const session = await getsession();  // your existing function 
    if (!session) {
        // No valid token → go back to login
        location.href = "/login";
    }
}
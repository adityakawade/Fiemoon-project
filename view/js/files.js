axios.defaults.baseURL = SERVER

window.onload = () => {
    showUserDeatails();
    fetchFile();
}

const toast = new Notyf({
    position: { x: 'center', y: 'top' }
});




const logout = () => {
    localStorage.clear();
    location.href = "/login";
}


const toggleDrawer = () => {
    const drawer = document.getElementById("drawer");
    const rightValue = drawer.style.right;
    if (rightValue === "0px") {
        drawer.style.right = "-33.33%"
    }
    else {
        drawer.style.right = "0px"
    }

}

const showUserDeatails = async () => {
    const session = await getsession();


    const fullname = document.getElementById("fullname");
    const email = document.getElementById("email");
    fullname.innerHTML = session.fullname;
    email.innerHTML = session.email;
}


const uploadFile = async (e) => {
    const uploadButton = document.getElementById("upload-btn");
    try {
        e.preventDefault();
        const progress = document.getElementById("progress");

        const form = e.target;
        const formdata = new FormData(form);

        // valodating file size
        const file = formdata.get('file');
        const size = getSize(file.size);
        if (size > 200) {
            return toast.error("file size too large only max size 200Mb is allowed");
        }


        const options = {
            onUploadProgress
                : (e) => {
                    const loaded = e.loaded;
                    const total = e.total;
                    const percantageValue = Math.floor((loaded * 100) / total);
                    console.log(percantageValue);
                    progress.style.width = percantageValue + '%';
                    progress.innerHTML = percantageValue + '%';
                }
        }

        uploadButton.disabled = true;
        const { data } = await axios.post('/api/file', formdata, options);
        toast.success(`${data.filename} has been uploaded !`);
        progress.style.width = 0;
        progress.innerHTML = '';
        fetchFile();
        form.reset();
        toggleDrawer();

    } catch (error) {
        toast.error(error.response ? error.response.data.message : error.message);
    }

    finally {
        uploadButton.disabled = false;
    }

}



const getSize = (size) => {
    const mb = (size / 1000) / 1000;
    return mb.toFixed(1)
}




const fetchFile = async () => {
    try {
        const { data } = await axios.get("/api/file");
        const tables = document.getElementById("files-table");
        tables.innerHTML = "";
        for (const file of data) {
            const ui = `
            <tr class="text-gray-500 border-b border-gray-100">
                        <td class="py-4 pl-6 capitalize">${file.filename}</td>
                        <td class ="capitalize">${file.type}</td>
                        <td> ${getSize(file.size)} Mb</td>
                        <td> ${moment(file.createdAt).format('DD-MMM-YYYY,   hh:mm A')}</td>
                        <td>
                            <div class="space-x-3" >
                                <button class=" px-2 py-1  text-white bg-rose-400  hover:bg-rose-600 rounded " onclick="deleteFile('${file._id}',this)">
                                    <i class="ri-delete-bin-3-line"></i>
                                </button>

                                <button class=" px-2 py-1  text-white bg-green-400  hover:bg-green-600 rounded " onclick="downloadFile('${file._id}','${file.filename}',this)">
                                    <i class="ri-download-line"></i>
                                </button>

                                <button class=" px-2 py-1  text-white bg-amber-400  hover:bg-amber-600 rounded " onclick="openModalForShare('${file._id}','${file.filename}')">
                                    <i class="ri-share-line"></i>
                                </button>
                            </div>
                        </td>
                    </tr>`

            tables.innerHTML += ui;

        }
    } catch (error) {
        toast.error(error.response ? error.response.data.message : error.message);
    }

}

const deleteFile = async (id, button) => {
    try {
        button.innerHTML = ' <i class="fa fa-spinner fa-spin "></i>';
        button.disabled = true;
        await axios.delete(`/api/file/${id}`);
        toast.success("File deleted !")
        fetchFile();
    } catch (error) {
        toast.error(error.response ? error.response.data.message : error.message);
    }
    finally {
        button.innerHTML = ' <i class="ri-delete-bin-3-line"></i>';
        button.disabled = false;
    }
}

const downloadFile = async (id, filename, button) => {
    try {
        button.innerHTML = ' <i class="fa fa-spinner fa-spin "></i>';
        button.disabled = true;

        const options = {
            responseType: 'blob'
        };
        const { data } = await axios.get(`api/file/download/${id}`, options);
        const ext = data.type.split("/").pop();
        const url = URL.createObjectURL(data);
        const a = document.createElement("a")
        a.href = url;
        a.download = `${filename}.${ext}`
        a.click();
        a.remove();
        toast.success("File downloaded successfully !")
    } catch (error) {
        if (!error.response) {
            return toast.error(error.message);
        }

        const err = await (error.response.data).text();
        const { message } = JSON.parse(err);
        toast.error(message)
    }
    finally {
        button.innerHTML = '<i class="ri-download-line"></i>';
        button.disabled = false;
    }
}


const openModalForShare = (id, filename) => {
    new swal(
        {
            showConfirmButton: false,
            html: `
            <form class="flex flex-col gap-6" onsubmit="shareFile(event,'${id}')">
            <h1 class="text-left font-medium text-2xl text-black">Email id</h1>
            <input name="email" type="email" required class="border border-gray-400 w-full p-3 rounded text-gray-600" placeholder="Enter Email For Sharing File"/>
            <button type="submit" id="send-button" class="bg-indigo-400 w-fit px-8 py-3 text-white rounded hover:bg-indigo-500 font-medium">Send</button>
            <div class="flex gap-2 items-center">
            <p class="text-gray-500"> You are Sharing -</p>
            <p class="text-green-400 font-medium">${filename}</p>
            </div>
            </form>
            `
        }
    )
}



const shareFile = async (e, id) => {

    try {
        e.preventDefault();
        const sendButton = document.getElementById("send-button");
        const form = e.target;
        sendButton.disabled = true;
        sendButton.innerHTML = `<i class="fa fa-spinner fa-spin mr-2 "></i>
        processing
        `
        const email = form.elements.email.value.trim();
        const payload = {
            email: email,
            fileId: id
        }
        await axios.post("/api/share", payload);
        toast.success(`File Send Successfully !`)


    } catch (error) {
        toast.error(error.response ? error.response.data.message : error.message)
    }
    finally {
        swal.close();
    }
}
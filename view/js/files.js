axios.defaults.baseURL = SERVER

window.onload = () => {
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


const uploadFile = async (e) => {
    try {
        e.preventDefault();
        const progress = document.getElementById("progress");
        const uploadButton = document.getElementById("upload-btn");
        const form = e.target;
        const formdata = new FormData(form);
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
        uploadButton.disabled = false;
        progress.style.width = 0;
        progress.innerHTML = '';
        fetchFile();
        form.reset();
        toggleDrawer();

    } catch (error) {
        toast.error(error.response ? error.response.data.message : error.message);
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
                                <button class=" px-2 py-1  text-white bg-rose-400  hover:bg-rose-600 rounded " onclick="deleteFile('${file._id}')">
                                    <i class="ri-delete-bin-3-line"></i>
                                </button>

                                <button class=" px-2 py-1  text-white bg-green-400  hover:bg-green-600 rounded " onclick="downloadFile('${file._id}','${file.filename}')">
                                    <i class="ri-download-line"></i>
                                </button>

                                <button class=" px-2 py-1  text-white bg-amber-400  hover:bg-amber-600 rounded ">
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

const deleteFile = async (id) => {
    try {
        await axios.delete(`/api/file/${id}`);
        toast.success("File deleted !")
        fetchFile();
    } catch (error) {
        toast.error(error.response ? error.response.data.message : error.message);
    }
}

const downloadFile = async (id,filename) => {
    try {
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
        toast.error(error.response ? error.response.data.message : error.message);
    }
}
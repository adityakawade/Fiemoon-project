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
    fetchedHistory()
}

const fetchedHistory = async () => {
    try {
        const { data } = await axios.get("/api/share", getAuthToken());
        const table = document.getElementById("history-tables");
        for (const item of data) {
            const ui = `  <tr class="text-gray-500 border-b border-gray-100">
                            <td class="py-4 pl-6 capitalize">${item.file.filename}</td>
                            <td>${item.receiverEmail}</td>
                            <td> ${moment(item.createdAt).format('DD MMM YYYY,   hh:mm A')}</td>
            </tr>`
            table.innerHTML +=ui;
        }

    } catch (error) {
        toast.error(error.response ? error.response.data.message : error.message);
    }
}
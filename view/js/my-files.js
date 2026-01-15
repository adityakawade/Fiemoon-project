axios.defaults.baseURL = SERVER


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


const uploadfiles = async (e) => {
    try {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const response = await axios.post("/api/file", formData);
        console.log(response.data);


    } catch (error) {
        console.log(error);

    }
}
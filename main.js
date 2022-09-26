document.body.className = localStorage.getItem("theme") || "";

document.querySelectorAll("[data-theme]").forEach(item => {
    item.addEventListener("click", () => {
        let value = item.getAttribute("data-theme");
        document.body.className = value;
        localStorage.setItem("theme", value);
    });
});

document.querySelectorAll("[data-open]").forEach(item => {
    item.addEventListener("click", () => {
        let id = item.getAttribute("data-open");
        document.getElementById(id).showModal();
        if (id != "task") {
            document.getElementById(id).querySelector("button[data-close]").focus();
        }
    });
});

document.querySelectorAll("[data-close]").forEach(item => {
    item.addEventListener("click", () => {
        document.getElementById(item.getAttribute("data-close")).close();
    });
});

document.getElementById("reset-theme").addEventListener("click", () => {
    localStorage.removeItem("theme");
});

document.getElementById("reset").addEventListener("click", () => {
    if (confirm("All saved data will be deleted. Would you like to continue?")) {
        localStorage.clear();
    }
});
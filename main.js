import { v4 as uuidv4 } from "https://jspm.dev/uuid";

const questionInput = document.getElementById("question");
const answerInput = document.getElementById("answer");

const feed = document.getElementById("feed");

var code = localStorage.getItem("clicker-code") || "";
var history = JSON.parse(localStorage.getItem("clicker-history") || "[]");
document.body.className = localStorage.getItem("clicker-theme") || "";

// Show enter code modal if no saved seat code is found
if (!code) {
    document.getElementById("code").showModal()
}

for (let i = 0; i < history.length; i++) {
    appendClick(history[i].question, history[i].answer);
}

document.querySelectorAll("[data-theme]").forEach(item => {
    item.addEventListener("click", () => {
        let value = item.getAttribute("data-theme");
        document.body.className = value;
        localStorage.setItem("clicker-theme", value);
    });
});

document.querySelectorAll("[data-open]").forEach(item => {
    item.addEventListener("click", () => {
        let id = item.getAttribute("data-open");
        document.getElementById(id).showModal();
        if (id != "code") {
            document.getElementById(id).querySelector("button[data-close]").focus();
        }
        else {
            document.getElementById("seat-code").value = code;
        }
    });
});

document.querySelectorAll("[data-close]").forEach(item => {
    item.addEventListener("click", () => {
        document.getElementById(item.getAttribute("data-close")).close();
    });
});

document.getElementById("seat-code").addEventListener("input", e => {
    if (parseInt(e.target.value)) {
        e.target.value = parseInt(e.target.value);
    }
    else {
        e.target.value = "";
    }
});

document.getElementById("save-code").addEventListener("click", () => {
    let input = document.getElementById("seat-code").value;
    let array = input.split("");
    // Only allows codes that are possible in room 233
    if (array[0] > 0 && array[1] > 0 && array[2] > 0 && array[0] <= 9 && array[1] <= 6 && array[2] <= 5) {
        code = input;
        localStorage.setItem("clicker-code", code);
        document.getElementById("code").close();
    }
    else {
        alert("That seat code isn't possible... 🤔");
    }
});

document.getElementById("submit").addEventListener("click", () => {
    let question = questionInput.value;
    let answer = answerInput.value;
    if (code) {
        if (question?.trim() && answer?.trim()) {
            submitClick(code, question, answer);
            appendClick(question, answer);
            storeClick(question, answer);
            questionInput.value = "";
            answerInput.value = "";
        }
        else {
            alert("Question and answer can't be empty 😔");
        }
    }
    else {
        document.getElementById("code").showModal();
    }
});

document.getElementById("reset-history").addEventListener("click", () => {
    localStorage.removeItem("clicker-history");
});

document.getElementById("reset-theme").addEventListener("click", () => {
    localStorage.removeItem("clicker-theme");
});

document.getElementById("reset").addEventListener("click", () => {
    if (confirm("All saved data will be deleted. Would you like to continue?")) {
        localStorage.removeItem("clicker-code");
        localStorage.removeItem("clicker-history");
        localStorage.removeItem("clicker-theme");
    }
});

function submitClick(code, question, answer) {
    let fields = {
        "entry.1896388126": code,
        "entry.1232458460": question,
        "entry.1065046570": answer
    }
    let params = new URLSearchParams(fields).toString();
    let url = "https://docs.google.com/forms/d/e/1FAIpQLSfwDCxVqO2GuB4jhk9iAl7lzoA2TsRlX6hz052XkEHbLrbryg/formResponse?" + params;

    fetch(url, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });
}

function appendClick(question, answer) {
    let uuid = uuidv4();
    feed.innerHTML = `<div id="${uuid}">
    <h3>${question}</h3>
    <p>${answer}</p>
    <div class="button-cluster">
        <button data-fill="${uuid}">Resubmit</button>
    </div>
</div>` + feed.innerHTML
    addResubmitEvents();

    // Remove no history message
    let message = document.getElementById("no-history-message");
    if (message) {
        message.remove();
    }
}

function addResubmitEvents() {
    document.querySelectorAll("[data-fill]").forEach(item => {
        item.addEventListener("click", () => {
            let uuid = item.getAttribute("data-fill");
            let question = document.getElementById(uuid).querySelector("h3").textContent;
            let answer = document.getElementById(uuid).querySelector("p").textContent;
            questionInput.value = question;
            answerInput.value = answer;
            document.getElementById("history").close();
        });
    });
}

function storeClick(question, answer) {
    let item = {
        "question": question,
        "answer": answer
    }
    history.push(item);
    localStorage.setItem("clicker-history", JSON.stringify(history));
}
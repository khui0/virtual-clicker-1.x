import { v4 as uuidv4 } from "https://jspm.dev/uuid";

const questionInput = document.getElementById("question");
const answerInput = document.getElementById("answer");

const feed = document.getElementById("feed");

var code = localStorage.getItem("clicker-code") || "";
var history = JSON.parse(localStorage.getItem("clicker-history") || "[]");
document.body.className = localStorage.getItem("clicker-theme") || "";

const aliases = {
    "a": ["Agree", "True", "Yes"],
    "b": ["Disagree", "False", "No"],
    "c": ["Both", "Always"],
    "d": ["Neither", "Never"],
    "e": ["Sometimes", "Cannot be determined"]
}

// Show enter code modal if no saved seat code is found
if (!code) {
    document.getElementById("code").showModal();
}
else {
    document.querySelector("h2").textContent = `Submit click (${code})`;
    document.querySelector("[data-open=code]").textContent = `Change (${code})`;
}

for (let i = 0; i < history.length; i++) {
    appendClick(history[i].question, history[i].timestamp, history[i].answer);
}

// Focus the question input for quick answering
questionInput.focus();

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

document.getElementById("seat-code").addEventListener("keydown", e => {
    if (e.key == "Enter") {
        e.preventDefault();
        document.getElementById("save-code").click();
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
        document.querySelector("h2").textContent = `Submit click (${code})`;
        document.querySelector("[data-open=code]").textContent = `Change (${code})`;
    }
    else {
        alert("That seat code isn't possible... 🤔");
    }
});

// Keybind to submit click
answerInput.addEventListener("keydown", e => {
    if (e.ctrlKey && e.key == "Enter") {
        document.getElementById("submit").click();
    }
});

// Hides multiple choice buttons if answer isn't empty
answerInput.addEventListener("input", () => {
    if (answerInput.value != "") {
        document.querySelectorAll("[data-choice]").forEach(button => {
            button.style.display = "none";
        });
    }
    else {
        document.querySelectorAll("[data-choice]").forEach(button => {
            button.style.display = "inline-block";
        });
    }
});

// Keybinds to insert math characters
document.addEventListener("keydown", e => {
    let chars = document.querySelectorAll("[data-insert]");
    if (e.altKey) {
        let key = parseInt(e.key);
        if (key > 0 && key <= chars.length) {
            e.preventDefault();
            chars[key - 1].click();
        }
    }
});

// Math character buttons
document.querySelectorAll("[data-insert]").forEach(button => {
    button.addEventListener("click", () => {
        answerInput.value += button.innerHTML;
        answerInput.dispatchEvent(new Event("input"));
        answerInput.focus();
    });
});

document.getElementById("submit").addEventListener("click", () => {
    let question = questionInput.value;
    let answer = answerInput.value;
    if (code) {
        if (question?.trim() && answer?.trim()) {
            let timestamp = Date.now();
            submitClick(code, question, answer);
            appendClick(question, timestamp, answer);
            storeClick(question, timestamp, answer);
            questionInput.value = "";
            answerInput.value = "";
            answerInput.dispatchEvent(new Event("input"));
            questionInput.focus();
        }
        else if (answer?.trim()) {
            let questionPrompt = prompt("Almost there! Enter a question number 🙃");
            if (questionPrompt) {
                questionInput.value = questionPrompt;
                document.getElementById("submit").click();
            }
        }
        else {
            alert("Question and answer can't be empty 😔");
        }
    }
    else {
        document.getElementById("code").showModal();
    }
});

// Show multiple choice preview
document.querySelectorAll("[data-choice]").forEach(button => {
    button.addEventListener("click", () => {
        let choice = button.getAttribute("data-choice");
        let modal = document.getElementById("choice");
        let list = modal.querySelector("ul");
        let submit = document.querySelector("[data-submit]");
        // Set title to show the selected choice
        modal.querySelector("h2").textContent = `Do you want to submit choice ${choice.toUpperCase()}?`;
        // Populate alias list according to the selected choice
        list.innerHTML = "";
        for (let i = 0; i < aliases[choice].length; i++) {
            list.innerHTML += `<li>${aliases[choice][i]}</li>`;
        }
        submit.setAttribute("data-submit", choice);
        modal.showModal();
        submit.focus();
    });
});

// Submit multiple choice answer
document.querySelector("[data-submit]").addEventListener("click", e => {
    let question = questionInput.value;
    let answer = `CHOICE ${e.target.getAttribute("data-submit").toUpperCase()}`;
    console.log(answer);
    if (code) {
        if (question?.trim()) {
            let timestamp = Date.now();
            submitClick(code, question, answer);
            appendClick(question, timestamp, answer);
            storeClick(question, timestamp, answer);
            questionInput.value = "";
        }
        else {
            let questionPrompt = prompt("Almost there! Enter a question number 😅");
            if (questionPrompt) {
                questionInput.value = questionPrompt;
                document.querySelector("[data-submit]").click();
            }
        }
        document.getElementById("choice").close();
        questionInput.focus();
    }
    else {
        document.getElementById("code").showModal();
    }
});

document.getElementById("reset-history").addEventListener("click", () => {
    alert("History has been reset. Refresh to see changes 🧼");
    localStorage.removeItem("clicker-history");
});

document.getElementById("reset-theme").addEventListener("click", () => {
    alert("Theme has been reset. Refresh to see changes 🦋");
    localStorage.removeItem("clicker-theme");
});

document.getElementById("reset").addEventListener("click", () => {
    if (confirm("All user data will be deleted. Would you like to continue?")) {
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

function appendClick(question, timestamp, answer) {
    let uuid = uuidv4();
    feed.innerHTML = `<div id="${uuid}">
    <h3>${question}</h3>
    <p>${timeToString(timestamp)}</p>
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
            let answer = document.getElementById(uuid).querySelectorAll("p")[1].textContent;
            questionInput.value = question;
            answerInput.value = answer;
            answerInput.dispatchEvent(new Event("input"));
            document.getElementById("history").close();
        });
    });
}

function storeClick(question, timestamp, answer) {
    let item = {
        "question": question,
        "timestamp": timestamp,
        "answer": answer
    }
    history.push(item);
    localStorage.setItem("clicker-history", JSON.stringify(history));
}

// Converts unix timestamp into string
function timeToString(timestamp) {
    let date = new Date(timestamp);
    if (timestamp) {
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hours = date.getHours();
        let minutes = date.getMinutes().toString().padStart(2, "0");
        let period;
        if (hours > 12) {
            hours %= 12;
            period = "PM";
        }
        else {
            period = "AM";
        }
        return `${month}/${day} ${hours}:${minutes} ${period}`;
    }
    else {
        return "Timestamp unknown"
    }
}
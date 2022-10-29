const replacements = {
    "sqrt": "√",
    "cbrt": "∛",
    "inf": "∞",
    "pi": "π",
    "theta": "θ",
    "int": "∫",
    "pm": "±",
    "rightarrow": "→",
    "or": "∨",
    "and": "∧",
    "subset": "⊂",
    "subseteq": "⊆",
    "subseteq": "⊆",
}

let temp = { query: "", index: 0, matches: [] };

// Even though querySelectorAll is used, multiple inputs do not work properly
document.querySelectorAll("[data-autocomplete]").forEach(input => {
    input.addEventListener("keydown", e => {
        if (e.key == "Tab" && e.target.selectionEnd == temp.index && temp.matches.length != 0) {
            e.preventDefault();
            e.target.setRangeText(replacements[temp.matches[0]], e.target.selectionEnd - temp.query.length, e.target.selectionEnd, "end");
            temp.query = "";
            temp.index = e.target.selectionEnd;
            getMatches();
            hideMessage(input);
        }
    });

    input.addEventListener("input", e => {
        if (e.target.selectionEnd == temp.index + 1 && e.data || temp.query == "") {
            temp.query += e.data;
            temp.index = e.target.selectionEnd;
        }
        else {
            temp.query = "";
            temp.index = e.target.selectionEnd;
        }

        getMatches();

        if (temp.matches.length != 0) {
            showMessage(input, `Press tab to enter "${replacements[temp.matches[0]]}"`)
        }
        else {
            temp.query = "";
            hideMessage(input);
        }
    });
});

function getMatches() {
    temp.matches = temp.query.length != 0 ? Object.keys(replacements).filter(string => string.startsWith(temp.query)) : [];
}

function showMessage(element, message) {
    !element.nextElementSibling.hasAttribute("data-autocomplete-message") && element.insertAdjacentHTML("afterend", `<p data-autocomplete-message></p>`);
    element.nextElementSibling.innerHTML = message;
}

function hideMessage(element) {
    element.nextElementSibling.hasAttribute("data-autocomplete-message") && element.nextElementSibling.remove();
}
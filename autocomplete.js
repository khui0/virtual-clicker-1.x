const replacements = {
    "sqrt": "√",
    "cbrt": "∛",
    "inf": "∞",
    "pi": "π",
    "theta": "θ",
    "int": "∫"
}

let temp = { query: "", index: 0, matches: [] };

document.querySelectorAll("[data-autocomplete]").forEach(input => {
    input.addEventListener("keydown", e => {
        if (e.key == "Tab" && e.target.selectionEnd == temp.index && temp.matches.length != 0) {
            e.preventDefault();
            e.target.setRangeText(replacements[temp.matches[0]], e.target.selectionEnd - temp.query.length, e.target.selectionEnd, "end");
            temp.query = "";
            temp.index = e.target.selectionEnd;
            getMatches();
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
            console.log(`press tab to enter "${temp.matches[0]}"`, temp.matches);
        }
        else {
            temp.query = "";
        }
    });
});

function getMatches() {
    temp.matches = temp.query.length != 0 ? Object.keys(replacements).filter(string => string.startsWith(temp.query)) : [];
}
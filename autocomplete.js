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
        if (e.key == "Tab" && temp.matches.length != 0) {
            e.preventDefault();
            e.target.setRangeText(replacements[temp.matches[0]], e.target.selectionEnd - temp.query.length, e.target.selectionEnd, "end");
            temp.query = "";
            temp.index = e.target.selectionEnd;
        }
    });

    input.addEventListener("input", e => {
        console.log(`last: ${temp.index} expected: ${temp.index + 1} current: ${e.target.selectionEnd} `);

        if (e.target.selectionEnd == temp.index + 1 && e.data || temp.query == "") {
            temp.query += e.data;
            temp.index = e.target.selectionEnd;
        }
        else {
            temp.query = "";
            temp.index = e.target.selectionEnd;
        }

        temp.matches = temp.query.length != 0 ? Object.keys(replacements).filter(string => string.startsWith(temp.query)) : [];

        if (temp.matches.length == 0) {
            temp.query = "";
            console.log("no matches, reset");
        }

        console.log(`"${temp.query}"`, temp.matches);
    });
});

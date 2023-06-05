const answer = document.getElementById("bean-answer");
const answerBody = document.getElementById("answer-body");
const table = document.getElementById("table");

function parseAnswer() {
    let body;
    const code = answer.value.split(" ")[0];
    if (code === "EXECUTE_ERROR") {
        body = answer.value.replace("EXECUTE_ERROR ", "");
        body = body.replace("ERROR:", "<span style='color: var(--errorcolor); font-weight: 700'>Error:</span>")
        answerBody.innerHTML = body;
    } else if(code === "EXECUTE_SUCCESS") {
        table.classList.remove("hidden");
        body = answer.value.replace("EXECUTE_SUCCESS ", "");
        let data = body.split("\n");

        body = buildHeader(data[0]);
        body += buildRows(data.slice(1));
        table.innerHTML = body;
    }
}

function buildHeader(row) {
    let string = "<tr class='table-header'>\n"
    for (let elem of row.split("\t")) {
        string += "<th>" + elem + "</th>";
    }
    string += "</tr>\n";
    return string;
}

function buildRows(data) {
    let string = "";
    for (let row of data) {
        string += "<tr>";
        for (let elem of row.split("\t")) {
            string += "<td>" + elem + "</td>";
        }
        string += "<tr>\n";
    }
    return string;
}

parseAnswer();
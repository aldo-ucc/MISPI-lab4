const x = document.getElementById('form:x-value');
const y = document.getElementById('form:y-value');
const r = document.getElementById('form:r-value');
const sqlQuery = document.getElementById('sql-form:sql-value');
const sqlErrorMsg = document.getElementById('sql-form:sql-error-msg');

const form = document.getElementById('form');
const canvas = document.getElementById("canvas");
const pointsCanvas = document.getElementById("points-canvas");
const context = canvas.getContext("2d");
const pointsContext = pointsCanvas.getContext("2d");
let points = new Set();

const style = getComputedStyle(document.body);

function getX() {
    return x.value.valueOf();
}

function getY() {
    return y.value.valueOf();
}

function getR() {
    return r.value.valueOf();
}

function validateX() {
    var xValues = ["-3", "-2", "-1", "0", "1", "2", "3", "4", "5",
        -3, -2, -1, 0, 1, 2, 3, 4, 5];
    return xValues.includes(getX());
}

function validateY() {
    if (y.value === "" || y.value === "-") return false;
    return getY() >= -2.999 && getY() <= 2.999;
}

function validateR() {
    var rValues = ["1", "2", "3", "4", "5"];
    return rValues.includes(getR());
}

function setX(value) {
    x.value = String(Math.round(value));
}

function setY(value) {
    y.value = value.toPrecision(4);
}

function setR(value) {
    r.value = String(Math.round(value));
}


function setValidationListener() {
    const xValidate = document.getElementById('x-validate');
    const yValidate = document.getElementById('y-validate');
    const rValidate = document.getElementById('r-validate');
    const sqlValidate = document.getElementById('sql-form:sql-validate');

    x.addEventListener("change", () => {
        if (validateX()) {
            updateCanvas();
            xValidate.classList.add('flipped');
        } else if (xValidate.classList.contains("flipped")) {
            xValidate.classList.remove('flipped');
        }
    });

    y.addEventListener("input", () => {
        if ((y.value.length === 7 && y.value.valueOf() < 0) || (y.value.length === 6 && y.value.valueOf() >= 0)) {
            y.value = y.value.slice(0, y.value.length - 1);
        }
        if (isNaN(y.value.valueOf()) && !(y.value.valueOf() == "-" || y.value.valueOf() == "+" || y.value.valueOf() == ".")) {
            y.value = y.value.slice(0, y.value.length - 1);
        }

        if (validateY()) {
            updateCanvas();
            yValidate.classList.add('flipped');
        } else if (yValidate.classList.contains("flipped")) {
            yValidate.classList.remove('flipped');
        }
    });

    r.addEventListener("input", () => {
        if (validateR()) {
            updateCanvas();
            rValidate.classList.add('flipped');
        } else {
            rValidate.classList.remove('flipped');
        }
    });

    sqlQuery.addEventListener("input", () => {
        if (sqlQuery.value.toLowerCase().indexOf("select") === 0) {
            if (!sqlValidate.classList.contains("flipped")) {
                sqlValidate.classList.add('flipped');
            }
        } else {
            if (sqlValidate.classList.contains("flipped")) {
                sqlValidate.classList.remove('flipped');
            }
        }
    });

    sqlQuery.addEventListener("click", () => {
        if (sqlQuery.classList.contains("sql-error")) {
            sqlQuery.classList.remove("sql-error");
        }
    });
    // try {
    //     let query = sqlQuery.value.replace(';', '');
    //     SQLParser.parse(query);
    //     if (!sqlValidate.classList.contains("flipped")) {
    //         sqlValidate.classList.add('flipped');
    //     }
    // } catch (exception) {
    //     if (sqlValidate.classList.contains("flipped")) {
    //         sqlValidate.classList.remove('flipped');
    //     }
    // }
}

function validate(event) {
    if (validateX() && validateY() && validateR()) {
        return true;
    } else {
        return false;
    }
}

function setFormListener() {
    form.onsubmit = function (event) {
        event.preventDefault();
        if (validate()) {
            form.setAttribute("method", method.classList.contains("g") ? "Get" : "Post");
            form.submit();
        }
    }
}

const CANVAS_OFFSET_X = 180;
const CANVAS_OFFSET_Y = 150;
const CANVAS_SCALE_X = 99;
const CANVAS_SCALE_Y = 97;

function drawPoint(x, y) {
    var radius = getR();
    x = x * CANVAS_SCALE_X / radius + CANVAS_OFFSET_X;
    y = -y * CANVAS_SCALE_Y / radius + CANVAS_OFFSET_Y;
    context.lineWidth = 2;
    context.strokeStyle = style.getPropertyValue('--textcolor');
    context.beginPath();
    // context.arc(x, y, 6, 0, 2 * Math.PI);
    context.moveTo(x - 4, y - 4);
    context.lineTo(x + 4, y + 4);
    context.moveTo(x + 4, y - 4);
    context.lineTo(x - 4, y + 4);
    context.stroke();
}

function drawCrosses() {
    pointsContext.clearRect(0, 0, pointsCanvas.width, pointsCanvas.height);
    for (let data of points) {
        data = data.split(" ");
        let xCoord = parseFloat(data[0]);
        let yCoord = parseFloat(data[1]);
        let radius = parseFloat(data[2]);
        let result = data[3];

        if (getR() == radius) {
            xCoord = xCoord * CANVAS_SCALE_X / radius + CANVAS_OFFSET_X;
            yCoord = -yCoord * CANVAS_SCALE_Y / radius + CANVAS_OFFSET_Y;

            pointsContext.lineWidth = 2;

            if (result !== "no") pointsContext.strokeStyle = style.getPropertyValue('--primarycolor');
            else pointsContext.strokeStyle = style.getPropertyValue('--errorcolor');

            pointsContext.beginPath();
            pointsContext.arc(xCoord, yCoord, 6, 0, 2 * Math.PI);

            pointsContext.moveTo(xCoord - 4, yCoord - 4);
            pointsContext.lineTo(xCoord + 4, yCoord + 4);

            pointsContext.moveTo(xCoord + 4, yCoord - 4);
            pointsContext.lineTo(xCoord - 4, yCoord + 4);
            pointsContext.stroke();
        }
    }
}

function updateCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (validateX() && validateY()) drawPoint(getX(), getY());
}

function canvasSetting() {
    var lastX = 0;
    var lastY = 0;
    var radius = 4;
    canvas.addEventListener("mousemove", function (event) {
        var rect = canvas.getBoundingClientRect();
        var sx = event.clientX - rect.left;
        var sy = event.clientY - rect.top;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.lineWidth = 2;
        if (validateR()) context.strokeStyle = style.getPropertyValue('--primarycolor');
        else context.strokeStyle = style.getPropertyValue('--errorcolor');
        context.beginPath();
        context.arc(sx, sy, 4, 0, 2 * Math.PI);
        context.stroke();

        if (validateR()) {
            radius = getR();
        }
        var x = sx - CANVAS_OFFSET_X;
        var y = sy - CANVAS_OFFSET_Y;
        x = Math.round(x / CANVAS_SCALE_X * radius);
        y = -y / CANVAS_SCALE_Y * radius;

        if (x < -3)
            x = -3;
        if (x > 5)
            x = 5;
        if (y <= -3)
            y = -2.999;
        if (y >= 3)
            y = 2.999;
        lastX = x;
        lastY = y;
        drawPoint(x, y);
    });
    canvas.addEventListener("click", function () {
        const xLink = document.getElementById("form:x" + (lastX + 4));
        const rLink = document.getElementById("form:r" + radius);

        xLink.dispatchEvent(new Event('click', {bubbles: true}));
        rLink.dispatchEvent(new Event('click', {bubbles: true}));
        setY(lastY);

        x.dispatchEvent(new Event('change', {bubbles: true}));
        y.dispatchEvent(new Event('input', {bubbles: true}));
        r.dispatchEvent(new Event('input', {bubbles: true}));
        y.dispatchEvent(new Event('change', {bubbles: true}));

        validate();

    });
    canvas.addEventListener("mouseleave", updateCanvas);
}

function selectX(currentX, value) {
    const xList = document.getElementsByClassName("x-selected");

    for (let i = 0; i < xList.length; i++) {
        xList[i].classList.remove("x-selected");
    }
    currentX.classList.add("x-selected");
    setX(value);
    x.dispatchEvent(new Event('change', {bubbles: true}));
}

function selectR(currentR, value) {
    const rList = document.getElementsByClassName("r-selected");
    const task = document.getElementById("task");
    let path = "url('../resources/svg/graphs/r" + value;

    for (let i = 0; i < rList.length; i++) {
        rList[i].classList.remove("r-selected");
    }
    currentR.classList.add("r-selected");
    setR(value);
    drawCrosses()
    updateCanvas();

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) path += ".svg')";
    else path += "_dark.svg')";
    task.style.backgroundImage = path;
    r.dispatchEvent(new Event('input', {bubbles: true}));
}

function pageSetting(data) {
    if (data.status === "success") {
        tableSetting();
        addPoints();
        drawCrosses();
        updateCanvas();
    }
}

function sqlError(data) {
    const sql = document.getElementById('sql-form:sql-value');
    if (data.status === "success") {
        console.log(sqlErrorMsg.value);
        if (sqlErrorMsg.value === "PARSE_ERROR") sql.classList.add("sql-error");
        if (sqlErrorMsg.value === "FORBIDDEN_COMMAND_ERROR") sql.value = "Only SELECT command are available";
    }
}

function addPoints() {
    points = new Set();
    const trs = new Set(document.getElementById("owner-table").getElementsByTagName("tr"));
    for (const tr of trs) {
        if (tr.innerText.indexOf("Result") === -1) {
            let data = tr.innerText.split("\t");
            let xCoord = parseFloat(data[0]);
            let yCoord = parseFloat(data[1]);
            let radius = parseFloat(data[2]);
            let result = data[4];

            if (!isNaN(xCoord) && !isNaN(yCoord) && !isNaN(radius)) {
                points.add(xCoord + " " + yCoord + " " + radius + " " + result);
            }
        }
    }
}

function tableSetting() {
    const trs = document.getElementsByTagName("tr");
    for (const tr of trs) {
        if (tr.innerText.indexOf("no") !== -1) {
            tr.classList.add("no");
        }
    }
}

tableSetting();
addPoints();
setValidationListener();
setFormListener();
canvasSetting();
x.value = "";
y.value = "";
r.value = "";
sqlQuery.value = "";
x.dispatchEvent(new Event('change', {bubbles: true}));
y.dispatchEvent(new Event('input', {bubbles: true}));
r.dispatchEvent(new Event('input', {bubbles: true}));
sqlQuery.dispatchEvent(new Event('input', {bubbles: true}));



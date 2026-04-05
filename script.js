class Transaction {
    constructor(amount, date, type, category, desc) {
        this.amount = amount;
        this.date = date;
        this.type = type;
        this.category = category;
        this.desc = desc;
    }
}

let data = JSON.parse(localStorage.getItem("data")) || [];

// modal
function openForm() {
    document.getElementById("modal").style.display = "block";
}
function closeForm() {
    document.getElementById("modal").style.display = "none";
}

// categories
let incomeCats = ["Salary", "Bonus"];
let expenseCats = ["Food", "Travel", "Shopping"];

// radio change
document.querySelectorAll("input[name='type']").forEach(r => {
    r.addEventListener("change", function () {
        let select = document.getElementById("subCategory");
        select.innerHTML = '<option value="">Select</option>';

        let arr = this.value === "income" ? incomeCats : expenseCats;

        arr.forEach(c => {
            let opt = document.createElement("option");
            opt.value = c;
            opt.text = c;
            select.appendChild(opt);
        });
    });
});

// form submit
document.getElementById("form").addEventListener("submit", function (e) {
    e.preventDefault();

    let amount = document.getElementById("amount");
    let date = document.getElementById("date");
    let type = document.querySelector("input[name='type']:checked");
    let cat = document.getElementById("subCategory");

    let valid = true;

    document.querySelectorAll(".error").forEach(e => e.innerText = "");
    document.querySelectorAll("input, select").forEach(i => i.classList.remove("error-border"));

    if (amount.value == "" || Number(amount.value) <= 0) {
        amount.classList.add("error-border");
        document.getElementById("amountError").innerText = "Enter valid amount";
        valid = false;
    }

    if (date.value == "" || new Date(date.value) > new Date()) {
        date.classList.add("error-border");
        document.getElementById("dateError").innerText = "Invalid date";
        valid = false;
    }

    if (!type) {
        document.getElementById("typeError").innerText = "Select type";
        valid = false;
    }

    if (cat.value == "") {
        cat.classList.add("error-border");
        document.getElementById("catError").innerText = "Select category";
        valid = false;
    }

    if (!valid) return;

    let t = new Transaction(amount.value, date.value, type.value, cat.value, document.getElementById("desc").value);

    data.push(t);
    localStorage.setItem("data", JSON.stringify(data));

    closeForm();
    showData();
});

// show
function showData() {
    let body = document.getElementById("tableBody");
    body.innerHTML = "";

    let filter = document.getElementById("filter").value;

    let list = data.filter(d => filter === "all" || d.type === filter);

    list.forEach((t, i) => {
        body.innerHTML += `
        <tr>
            <td>${t.date}</td>
            <td>${t.type}</td>
            <td>${t.category}</td>
            <td>${t.desc}</td>
            <td>${t.amount}</td>
            <td><button onclick="deleteItem(${i})">Delete</button></td>
        </tr>`;
    });

    drawChart();
}

// delete
function deleteItem(i) {
    data.splice(i, 1);
    localStorage.setItem("data", JSON.stringify(data));
    showData();
}

// sort
function sortByAmount() {
    data.sort((a, b) => a.amount - b.amount);
    showData();
}

// CSV download
function downloadCSV() {
    let csv = "Date,Type,Category,Description,Amount\n";

    data.forEach(t => {
        csv += `${t.date},${t.type},${t.category},${t.desc},${t.amount}\n`;
    });

    let blob = new Blob([csv]);
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "data.csv";
    a.click();
}

// simple chart
function drawChart() {
    let canvas = document.getElementById("chart");
    let ctx = canvas.getContext("2d");

    let total = 0;
    data.forEach(t => {
        if (t.type === "expense") total += Number(t.amount);
    });

    let x = 0;

    data.forEach(t => {
        if (t.type === "expense") {
            let slice = (t.amount / total) * Math.PI * 2;

            ctx.beginPath();
            ctx.moveTo(150, 100);
            ctx.arc(150, 100, 80, x, x + slice);
            ctx.fillStyle = "#" + Math.floor(Math.random()*16777215).toString(16);
            ctx.fill();

            x += slice;
        }
    });
}

showData();

class Transaction {
    constructor(amount, date, type, category, desc) {
        this.amount = amount;
        this.date = date;
        this.type = type;
        this.category = category;
        this.desc = desc;
    }
}

let transactions = JSON.parse(localStorage.getItem("data")) || [];
let editIndex = -1;

// Save or update
function saveTransaction() {
    let amount = document.getElementById("amount").value;
    let date = document.getElementById("date").value;
    let type = document.getElementById("type").value;
    let category = document.getElementById("category").value;
    let desc = document.getElementById("desc").value;

    if (amount === "" || type === "") {
        alert("Please fill required fields");
        return;
    }

    let t = new Transaction(amount, date, type, category, desc);

    if (editIndex === -1) {
        transactions.push(t);
    } else {
        transactions[editIndex] = t;
        editIndex = -1;
    }

    localStorage.setItem("data", JSON.stringify(transactions));

    clearForm();
    showData();
}

// Show data
function showData() {
    let body = document.getElementById("tableBody");
    body.innerHTML = "";

    let income = 0;
    let expense = 0;

    for (let i = 0; i < transactions.length; i++) {
        let t = transactions[i];

        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${t.date}</td>
            <td>${t.type}</td>
            <td>${t.category}</td>
            <td>${t.desc}</td>
            <td>${t.amount}</td>
            <td>
                <button class="edit" onclick="editItem(${i})">Edit</button>
                <button class="delete" onclick="deleteItem(${i})">Delete</button>
            </td>
        `;

        body.appendChild(row);

        if (t.type === "income") {
            income += Number(t.amount);
        } else {
            expense += Number(t.amount);
        }
    }

    document.getElementById("income").innerText = income;
    document.getElementById("expense").innerText = expense;
    document.getElementById("balance").innerText = income - expense;
}

// Delete
function deleteItem(index) {
    if (confirm("Are you sure?")) {
        transactions.splice(index, 1);
        localStorage.setItem("data", JSON.stringify(transactions));
        showData();
    }
}

// Edit
function editItem(index) {
    let t = transactions[index];

    document.getElementById("amount").value = t.amount;
    document.getElementById("date").value = t.date;
    document.getElementById("type").value = t.type;
    document.getElementById("category").value = t.category;
    document.getElementById("desc").value = t.desc;

    editIndex = index;
}

// Clear form
function clearForm() {
    document.getElementById("amount").value = "";
    document.getElementById("date").value = "";
    document.getElementById("type").value = "";
    document.getElementById("category").value = "";
    document.getElementById("desc").value = "";
}

// Load
showData();

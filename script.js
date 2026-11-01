
// MENGAMBIL DAN MENYIMPAN DATA
function getData(key) {
    try {
        return JSON.parse(localStorage.getItem(key) || "[]");
    } catch {
        return [];
    }
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// MENCEGAH TEKS DIANGGAP SEBAGAI HTML
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

// TANGGAL HARI INI
document.getElementById("today").textContent =
    new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

// NAVIGASI MENU
document.querySelectorAll(".nav-btn").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".nav-btn").forEach(b =>
            b.classList.remove("active")
        );

        document.querySelectorAll(".page").forEach(page =>
            page.classList.remove("active")
        );

        button.classList.add("active");

        document.getElementById(button.dataset.page)
            .classList.add("active");
    });
});

// CATATAN HARIAN
let journals = getData("journals");

function showJournals() {
    document.getElementById("journalList").innerHTML =
        journals.map((item, index) => `
            <div class="entry">
                <small>${escapeHTML(item.date)}</small>
                <p>${escapeHTML(item.text)}</p>
                <button onclick="deleteJournal(${index})">Hapus</button>
            </div>
        `).join("");
}

function deleteJournal(index) {
    if (!confirm("Hapus cerita ini?")) return;

    journals.splice(index, 1);
    saveData("journals", journals);
    showJournals();
}

document.getElementById("saveJournal").onclick = () => {
    const text = document.getElementById("journalText").value.trim();

    if (!text) return alert("Silakan tulis ceritamu terlebih dahulu!");

    journals.unshift({
        text,
        date: new Date().toLocaleDateString("id-ID")
    });

    saveData("journals", journals);
    document.getElementById("journalText").value = "";

    showJournals();
    alert("Cerita berhasil disimpan! 💙");
};

showJournals();

// JADWAL KEGIATAN
let tasks = getData("tasks");

function showTasks() {
    document.getElementById("taskList").innerHTML =
        tasks.map((task, index) => `
            <li>
                <label>
                    <input type="checkbox"
                        style="width:auto"
                        ${task.done ? "checked" : ""}
                        onchange="toggleTask(${index})">
                    <span style="${task.done ? "text-decoration:line-through" : ""}">
                        ${escapeHTML(task.name)}
                    </span>
                </label>
                <button onclick="deleteTask(${index})">Hapus</button>
            </li>
        `).join("");
}

function toggleTask(index) {
    tasks[index].done = !tasks[index].done;
    saveData("tasks", tasks);
    showTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveData("tasks", tasks);
    showTasks();
}

document.getElementById("addTask").onclick = () => {
    const input = document.getElementById("taskInput");
    const name = input.value.trim();

    if (!name) return alert("Silakan tulis kegiatanmu!");

    tasks.push({ name, done: false });

    saveData("tasks", tasks);
    input.value = "";
    showTasks();
};

showTasks();

// KENANGAN
let memories = getData("memories");

function showMemories() {
    document.getElementById("memoryList").innerHTML =
        memories.map((memory, index) => `
            <div class="entry">
                💙 ${escapeHTML(memory)}
                <br>
                <button onclick="deleteMemory(${index})">Hapus</button>
            </div>
        `).join("");
}

function deleteMemory(index) {
    memories.splice(index, 1);
    saveData("memories", memories);
    showMemories();
}

document.getElementById("addMemory").onclick = () => {
    const input = document.getElementById("memoryInput");
    const value = input.value.trim();

    if (!value) return alert("Silakan tulis kenanganmu!");

    memories.unshift(value);
    saveData("memories", memories);
    input.value = "";
    showMemories();

    alert("Kenangan berhasil disimpan! 💙");
};

showMemories();

// KEUANGANKU
let transactions = getData("transactions");

function showWallet() {
    let balance = 0;

    transactions.forEach(item => {
        balance += item.type === "in"
            ? item.amount
            : -item.amount;
    });

    document.getElementById("balance").textContent =
        "Rp" + balance.toLocaleString("id-ID");

    document.getElementById("moneyList").innerHTML =
        transactions.map((item, index) => `
            <li>
                ${escapeHTML(item.note)}
                <br>
                <strong>
                    ${item.type === "in" ? "+" : "-"}
                    Rp${item.amount.toLocaleString("id-ID")}
                </strong>
                <br>
                <button onclick="deleteMoney(${index})">Hapus</button>
            </li>
        `).join("");
}

function deleteMoney(index) {
    transactions.splice(index, 1);
    saveData("transactions", transactions);
    showWallet();
}

document.getElementById("addMoney").onclick = () => {
    const amount = Number(document.getElementById("amount").value);
    const note = document.getElementById("note").value.trim();
    const type = document.getElementById("type").value;

    if (!Number.isSafeInteger(amount) || amount <= 0 || !note) {
        return alert("Masukkan jumlah uang dan keterangan dengan benar!");
    }

    transactions.unshift({ amount, note, type });

    saveData("transactions", transactions);

    document.getElementById("amount").value = "";
    document.getElementById("note").value = "";

    showWallet();
    alert("Transaksi berhasil disimpan!");
};

showWallet();

// IMPIAN DAN CITA-CITA
let goals = getData("goals");

function showGoals() {
    document.getElementById("goalList").innerHTML =
        goals.map((goal, index) => `
            <li>
                <label>
                    <input type="checkbox"
                        style="width:auto"
                        ${goal.done ? "checked" : ""}
                        onchange="toggleGoal(${index})">
                    <span style="${goal.done ? "text-decoration:line-through" : ""}">
                        ${escapeHTML(goal.name)}
                    </span>
                </label>
                <button onclick="deleteGoal(${index})">Hapus</button>
            </li>
        `).join("");
}

function toggleGoal(index) {
    goals[index].done = !goals[index].done;
    saveData("goals", goals);
    showGoals();
}

function deleteGoal(index) {
    goals.splice(index, 1);
    saveData("goals", goals);
    showGoals();
}

document.getElementById("addGoal").onclick = () => {
    const input = document.getElementById("goalInput");
    const name = input.value.trim();

    if (!name) return alert("Silakan tulis impianmu!");

    goals.push({ name, done: false });

    saveData("goals", goals);
    input.value = "";
    showGoals();

    alert("Impian berhasil ditambahkan! ⭐");
};

showGoals();

const transactionForm = document.getElementById('transaction-form');
const typeInput = document.getElementById('type');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const dateInput = document.getElementById('date');
const clearBtn = document.getElementById('clear-btn');

const totalIncomeEl = document.getElementById('total-income');
const totalExpensesEl = document.getElementById('total-expenses');
const currentBalanceEl = document.getElementById('current-balance');

const transactionList = document.getElementById('transaction-list');
const filterType = document.getElementById('filter-type');
const searchInput = document.getElementById('search');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function init() {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    renderTransactions();
    updateSummary();
}

function addTransaction(e) {
    e.preventDefault();

    const amountValue = parseFloat(amountInput.value);

    if (amountValue <= 0 || isNaN(amountValue)) {
        alert('Please enter a valid amount greater than zero.');
        return;
    }

    if (!descriptionInput.value || !categoryInput.value || !dateInput.value) {
        alert('Please fill in all required fields.');
        return;
    }

    const newTransaction = {
        id: Date.now(),
        type: typeInput.value,
        description: descriptionInput.value,
        amount: amountValue,
        category: categoryInput.value,
        date: dateInput.value
    };

    transactions.push(newTransaction);
    saveToLocalStorage();
    renderTransactions();
    updateSummary();
    transactionForm.reset();
    dateInput.value = new Date().toISOString().split('T')[0];
    alert('Transaction added successfully!');
}

function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveToLocalStorage();
    renderTransactions();
    updateSummary();
}

function clearForm() {
    transactionForm.reset();
    dateInput.value = new Date().toISOString().split('T')[0];
}

function updateSummary() {
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach(t => {
        if (t.type === 'Income') {
            totalIncome += t.amount;
        } else if (t.type === 'Expense') {
            totalExpenses += t.amount;
        }
    });

    const currentBalance = totalIncome - totalExpenses;

    totalIncomeEl.textContent = `LKR ${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    totalExpensesEl.textContent = `LKR ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    currentBalanceEl.textContent = `LKR ${currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function renderTransactions() {
    transactionList.innerHTML = '';

    const filterValue = filterType.value;
    const searchValue = searchInput.value.toLowerCase();

    let filteredTransactions = transactions.filter(t => {
        const matchesType = filterValue === 'All' || t.type === filterValue;
        const matchesSearch = t.description.toLowerCase().includes(searchValue) || t.category.toLowerCase().includes(searchValue);
        return matchesType && matchesSearch;
    });

    if (filteredTransactions.length === 0) {
        transactionList.innerHTML = `<tr><td colspan="6" class="empty-message">No transactions found.</td></tr>`;
        return;
    }

    filteredTransactions.forEach(t => {
        const row = document.createElement('tr');
        const badgeClass = t.type === 'Income' ? 'badge-income' : 'badge-expense';
        const sign = t.type === 'Income' ? '+' : '-';

        row.innerHTML = `
            <td>${t.date}</td>
            <td>${t.description}</td>
            <td><span class="${badgeClass}">${t.type}</span></td>
            <td>${t.category}</td>
            <td>${sign} LKR ${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td><button class="delete-btn" onclick="deleteTransaction(${t.id})">Delete</button></td>
        `;

        transactionList.appendChild(row);
    });
}

function saveToLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

transactionForm.addEventListener('submit', addTransaction);
clearBtn.addEventListener('click', clearForm);
filterType.addEventListener('change', renderTransactions);
searchInput.addEventListener('input', renderTransactions);

window.onload = init;
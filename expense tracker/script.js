document.addEventListener('DOMContentLoaded', () => {
  const CATEGORIES = [
    'Food',
    'Transport',
    'Shopping',
    'Utilities',
    'Entertainment',
    'Health',
    'Other'
  ];

  // DOM Elements
  const expenseForm = document.getElementById('expense-form');
  const descriptionInput = document.getElementById('description');
  const amountInput = document.getElementById('amount');
  const categorySelect = document.getElementById('category');
  const expenseTableBody = document.getElementById('expense-table-body');
  const totalAmountCell = document.getElementById('total-amount');
  const expenseListContainer = document.getElementById('expense-list-container');
  const noExpensesMessage = document.getElementById('no-expenses-message');
  const formError = document.getElementById('form-error');

  // Populate category dropdown
  CATEGORIES.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
  
  // Load expenses from local storage
  let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

  const saveExpenses = () => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  };

  const renderExpenses = () => {
    // Clear existing table rows
    expenseTableBody.innerHTML = '';

    if (expenses.length === 0) {
        noExpensesMessage.classList.remove('d-none');
        expenseListContainer.querySelector('.table-responsive').classList.add('d-none');
    } else {
        noExpensesMessage.classList.add('d-none');
        expenseListContainer.querySelector('.table-responsive').classList.remove('d-none');
    }

    let total = 0;
    expenses.forEach(expense => {
      const row = document.createElement('tr');
      
      row.innerHTML = `
        <td class="p-3 fw-medium">${expense.description}</td>
        <td class="p-3 text-success fw-semibold">$${expense.amount.toFixed(2)}</td>
        <td class="p-3">${expense.category}</td>
        <td class="p-3 text-end">
          <button class="btn btn-outline-danger btn-sm" data-id="${expense.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16" style="pointer-events: none;">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
            </svg>
          </button>
        </td>
      `;
      expenseTableBody.appendChild(row);
      total += expense.amount;
    });

    totalAmountCell.textContent = `$${total.toFixed(2)}`;
  };
  
  const showError = (message) => {
    formError.textContent = message;
    formError.classList.remove('d-none');
  }

  const hideError = () => {
    formError.classList.add('d-none');
  }

  // Handle form submission
  expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    hideError();

    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const category = categorySelect.value;

    if (!description || !amount) {
      showError('Description and amount are required.');
      return;
    }

    if (amount <= 0 || isNaN(amount)) {
      showError('Please enter a valid positive amount.');
      return;
    }

    const newExpense = {
      id: crypto.randomUUID(),
      description,
      amount,
      category
    };

    expenses.unshift(newExpense);
    saveExpenses();
    renderExpenses();

    // Reset form
    expenseForm.reset();
    categorySelect.value = CATEGORIES[0];
  });

  // Handle delete button clicks
  expenseTableBody.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' && e.target.dataset.id) {
      const expenseId = e.target.dataset.id;
      expenses = expenses.filter(expense => expense.id !== expenseId);
      saveExpenses();
      renderExpenses();
    }
  });

  // Initial render
  renderExpenses();
});
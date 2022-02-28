// Funcionalidades do Modal

const Modal = {
  open(){
    document.querySelector('.modal-overlay').classList.add('active')
  },
  close(){
    document.querySelector('.modal-overlay').classList.remove('active')
  }
}

const transactionsData = [
  {
    id: 1,
    description: 'Luz',
    amount: 23400,
    date: '23/01/2022',
  },
  {
    id: 2,
    description: 'Website',
    amount: 50000,
    date: '02/01/2022',
  },
  {
    id: 3,
    description: 'Internet',
    amount: -8000,
    date: '15/01/2022',
  }
]  

const Transactions = {
  all: transactionsData,

  add(transaction) {
    Transactions.all.push(transaction)

    App.reload()
  },

  incomes() {
    let income = 0

    Transactions.all.forEach(transaction => {
      if (transaction.amount > 0) {
        income += transaction.amount
      }
    })

    return income
  }, 

  expenses() {
    let expense = 0

    Transactions.all.forEach(function(transaction) {
      if (transaction.amount < 0) {
        expense += transaction.amount
      }
    })
    return expense
  },

  total() {
    return Transactions.incomes() + Transactions.expenses()
  }
}

const Utils = {
  formatCurrency(value) {
    const signal = Number(value) < 0 ? '-' : ''
    value = String(value).replace(/\D/g, '')

    value = Number(value) / 100

    value = value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
    
    return signal + value
  }
}

const DOM = {
  transactionContainer: document.querySelector('#data-table tbody'),

  addTransaction(transaction, index) {
    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMLTransaction(transaction)

    DOM.transactionContainer.appendChild(tr)

  },

  innerHTMLTransaction(transaction) {
    const CSSclass = transaction.amount > 0 ? 'income' : 'expense'

    const amount = Utils.formatCurrency(transaction.amount)

    const html = `
      <td class='description'>${transaction.description}</td>
      <td class='${CSSclass}'>${amount}</td>
      <td class='date'>${transaction.date}</td>
      <td>
        <img src="./assets/minus.svg" alt="Remoção de transação">
      </td>
    `

    return html
  },

  updateBalance() {
    document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transactions.incomes())
    document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transactions.expenses())
    document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transactions.total())
  },

  clearTransections() {
    DOM.transactionContainer.innerHTML = ''
  }
}

const App = {
  init() {

    Transactions.all.forEach(transaction => {
      DOM.addTransaction(transaction)
    })

    DOM.updateBalance()

  },
  reload() {
    DOM.clearTransections()
    App.init()
  }
}

App.init()

Transactions.add({
  id: 39,
  description: 'Alô',
  amount: 200,
  date: '23/01/2021'
})




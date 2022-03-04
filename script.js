// Funcionalidades do modal
const Modal = {
  open(){
    document.querySelector('.modal-overlay').classList.add('active')
  },

  close(){
    document.querySelector('.modal-overlay').classList.remove('active')
  }
}

// Funcionalidades de armazenamento de dadoss
const Storage = {
  get() {
    return JSON.parse(localStorage.getItem('dev.finances:transactions')) || []
  },

  set(transactions) {
    localStorage.setItem('dev.finances:transactions', JSON.stringify(transactions))
  }
}

// Funcionalidades das transações
const Transactions = {
  all: Storage.get(),

  add(transaction) {
    Transactions.all.push(transaction)

    App.reload()
  },

  remove(index) {
    Transactions.all.splice(index, 1)

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

    Transactions.all.forEach(transaction => {
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

// Funcionalidades úteis (formatação de dados)
const Utils = {
  formatAmount(value) {
    value = value * 100

    return Math.round(value)
  },

  formatDate(date) {
    // Separando as informações da Data em AAAA-MM-DD
    const splittedDate = date.split('-')

    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  },

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

// Funcionalidades referentes a DOM
const DOM = {
  transactionContainer: document.querySelector('#data-table tbody'),

  addTransaction(transaction, index) {
    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMLTransaction(transaction)

    tr.dataset.index = index

    DOM.transactionContainer.appendChild(tr)

  },

  innerHTMLTransaction(transaction, index) {
    const CSSclass = transaction.amount > 0 ? 'income' : 'expense'

    const amount = Utils.formatCurrency(transaction.amount)

    const html = `
      <td class='description'>${transaction.description}</td>
      <td class='${CSSclass}'>${amount}</td>
      <td class='date'>${transaction.date}</td>
      <td>
        <img onclick='Transactions.remove(${index})' src="./assets/minus.svg" alt="Remoção de transação">
      </td>
    `

    return html
  },

  updateBalance() {
    document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transactions.incomes())
    document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transactions.expenses())
    document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transactions.total())
  },

  totalCollorChange() {
    const totalDisplay = document.querySelector('.total')
    const totalValue = Transactions.total()

    if (totalValue < 0){
      totalDisplay.classList.add('bg-red')
    }

    if (totalValue >= 0 && totalDisplay.className == 'cards total bg-red' ) {
      totalDisplay.classList.remove('bg-red')
    }
  },

  clearTransactions() {
    DOM.transactionContainer.innerHTML = ''
  }
}

// Funcionalidades referentes ao formulário
const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },

  formatData() {
    let {description, amount, date} = Form.getValues()

    amount = Utils.formatAmount(amount)

    date = Utils.formatDate(date)

    return {
      description,
      amount,
      date
    }
  },
  
  validateFields() {
    const {description, amount, date} = Form.getValues()
    
    // Validando se há algum campo vazio
    if (description.trim() === '' || amount.trim() === '' || date.trim() === ''){
      throw new Error('Por favor, preencha todos os campos.')
    }
  },

  saveTransaction(transaction) {
    Transactions.add(transaction)
  },

  clearFields() { 
    Form.description.value = ''
    Form.amount.value = ''
    Form.date.value = ''
  },

  submit(event) {
    // Interrompendo comportamento padrão
    event.preventDefault()

    try {
      Form.validateFields()
      const transaction = Form.formatData()
      Form.saveTransaction(transaction)

      Form.clearFields()

      Modal.close()

    } catch (error) {
      alert(error.message)
    }
  }
}

// Funcionalidades de inicialização e recarregamento da página
const App = {
  init() {

    Transactions.all.forEach((transaction, index) => {
      DOM.addTransaction(transaction, index)
    })

    DOM.updateBalance()
    DOM.totalCollorChange()

    Storage.set(Transactions.all)

  },
  
  reload() {
    DOM.clearTransactions()
    App.init()
  }
}

App.init()

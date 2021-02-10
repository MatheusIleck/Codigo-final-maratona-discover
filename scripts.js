const Modal = {
    open(){
        //abrir modal
        //adicionar a classe active ao modal
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')
    },
    close(){
        //fechar modal
        //remover a classe active do modal
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')
    }
}

const Storage ={

    get(){
        //estou convertendo para array novamente
        return JSON.parse(localStorage.getItem("dev.finances:transactions"))||
        []
    },
    
    set(transactions){
        //transformando para string = stringify()
        localStorage.setItem("dev.finances:transactions", JSON.
        stringify(transactions))
    }
}
const Transaction = {
    all: Storage.get(),
    add(transaction){
        Transaction.all.push(transaction)
        
        App.reload()
    },
    remove(index){
        //splice é um metodos que aplica em arrays que espera 
        //o numero do index pra remover
        Transaction.all.splice(index, 1)

    
        App.reload()

    },


    incomes() {
        let income = 0;
        //somar as entradas
        //pegar todas as transações
        //Para cada transação
        Transaction.all.forEach(transaction => {
            //se for maior que zero
            if(transaction.amount > 0) {
                //somar a uma variavel e retornar a variavel
                income = income + transaction.amount;
            }
        })
         
        return income;
        
    },
    expenses() {
        let expense = 0;
        Transaction.all.forEach(transaction => {
            if(transaction.amount < 0) {
                expense = expense + transaction.amount;
            }
        })
        return expense
    },
    total() {
        //entradas - saidas 
        return Transaction.incomes() + Transaction.expenses()
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    
    
    addTransaction(transaction, index){
    
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index
        DOM.transactionsContainer.appendChild(tr)

    },
    innerHTMLTransaction(transaction, index) {
        const CSSclas= transaction.amount > 0 ? "income" : "expense"
        
        const amount = Utils.formatcurrency(transaction.amount)
        

        const html = `  
        
            <td class="description">${transaction.description}</td>
            <td class="${CSSclas}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <th>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover 
                transação">
            </th>
    `

        return html

    },

    updateBalance() {
     document
        .getElementById('incomeDisplay')
        .innerHTML = Utils.formatcurrency(Transaction.incomes())
    document
        .getElementById('expenseDisplay')
        .innerHTML = Utils.formatcurrency(Transaction.expenses())
    document
        .getElementById('totalDisplay')
        .innerHTML = Utils.formatcurrency(Transaction.total())
    },

    
    //Função que limpa todo o conteudo para não ter repetição de dados
    clearTransactions(){
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {

    formatAmount(value){
        value = Number(value) * 100

        return value
    },

    formatDate(date){
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },


    //pegando o valor
    formatcurrency(value){
    //trabalho o sinal dele
    const signal = Number(value) < 0 ? "-" : ""

    //remoção de qualquer caractere especial
    value = String(value).replace(/\D/g, "")

    //eu divido ele por 100 pq estou guardando ele sempre multiplicado por 100
    //pra tratar as virgulas
    value = Number(value) /  100

    //formato o dinheiro
    value = value.toLocaleString("pt-BR",{
        style: "currency",
        currency: "BRL"
    })

    //retorna pra mim o dinheiro formatado positivo ou negativo
    return signal + value
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    
    //pega os valores e retorna
    getValues(){
        return{
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }

    },

    validateFields(){
        const {description, amount, date}  = Form.getValues()


        if(description.trim() === "" ||
         amount.trim() === "" ||
         date.trim() === "") {
             throw new Error("Por favor, preencha todos os campos")
         }
    },

    formatValues(){
        let {description, amount, date}  = Form.getValues()
        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)
        
        return{
            description,
            amount,
            date
        }
    },
   
    ClearFields(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },
        
    submit(event){
       event.preventDefault()
        console.log(amount.value)
        try {
        // verificar se todas as informações foram preenchidas
        Form.validateFields()
        //Formatar os dados para salvar
        const transaction = Form.formatValues()
        //salvar
        Transaction.add(transaction)
        //Apagar os dados do formulario
        Form.ClearFields()
        //fechar Modal
        Modal.close()
        //atualizar a aplicação
        } catch (error) {
            alert(error.message)
        }
        

    }
}

const App = {
    init(){
        //adicionando na DOM
        Transaction.all.forEach((transaction, index) =>{
            DOM.addTransaction(transaction, index)
        })
        
        DOM.updateBalance() //atualizando os cards
        
        
        Storage.set(Transaction.all) //atualizandoo LocalStorage

    },
    reload(){
        //Função que limpa todo o conteudo para não ter repetição de dados
        DOM.clearTransactions()
        App.init()
    },
}

App.init()







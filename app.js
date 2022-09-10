
const app = Vue.createApp({
    data() {
        return {
            inputDelete: false,
            readOnlyInput: false,
            buttonMessage: 'Inserir',
            checked: false,
            message: '',
            selected: 'selecione',
            key: '',
            listaLigada: {count: 0, head: {key: null, next: null}},
            listaDupla: {count: 0, head: {key: null, next: null, last: null}},
            listaCircular: {count: 0, head: {key: null, next: null, last: null}},
            pilha: {count: 0, head: {key: null, next: null}},
            fila: {count: 0, head: {key: null, next: null, last: null}},
            arr: [],
            cur: null
        }
    },
    created() {
        this.listaCircular.head.next = this.listaCircular.head
        this.listaCircular.head.last = this.listaCircular.head
        this.fila.head.next = this.fila.head
        this.fila.head.last = this.fila.head
    },
    methods: {
        push(e) {
            var head = null
            switch(this.selected) {
                case '':
                case 'selecione':
                    this.message = 'Selecione uma opção de tipo de dado!'
                    console.log(this.message)
                    break;
                case 'simples':
                case 'pilha':
                    // Inserção em Lista Ligada com Cabeça ou Fila, o método é equivalente
                    this.selected == 'simples' ? head = this.listaLigada.head : head = this.pilha.head
                    newNode = {
                        key: this.key,
                        next: head.next
                    }
                    head.next = newNode
                    this.selected == 'simples' ? this.listaLigada.count++ : this.pilha.count++
                    break;
                case 'dupla':
                    head = this.listaDupla.head
                    newNode = {
                        key: this.key,
                        next: null,
                        last: head
                    }
                    newNode.next = head.next
                    if(head.next)
                        head.next.last = newNode
                    head.next = newNode
                    this.listaDupla.count++
                    break
                case 'circular':
                case 'fila':
                    // Nesta implementação utilizei uma lista circular para representar a pilha
                    this.selected == 'circular' ? head = this.listaCircular.head : head = this.fila.head
                    var newNode = {
                        key: this.key,
                        next: head.next,
                        last: head
                    }
                    head.next.last = newNode
                    head.next = newNode
                    this.selected == 'circular' ? this.listaCircular.count++ : this.fila.count++
                    break
            }
            this.arrayUpdater(head)
            // Reseta o valor para impedir que o usuário insira o mesmo sem querer
            this.key = null
            if(this.selected != 'selecione')
                this.message = ''
        },
        pop(e) {
            switch(this.selected) {
                case '':
                case 'selecione':
                    this.message = 'Selecione uma opção de tipo de dado!'
                    console.log(this.message)
                    break;
                case 'simples':
                    head = this.listaLigada.head
                    // Busca a chave dentro da lista ligada
                    p = head.next
                    ant = null
                    while(p && p.key != this.key) {
                        ant = p
                        p = p.next
                    }
                    // Verifica se o item pertence à lista ligada
                    if(!p) {
                        this.message = 'O item buscado não pertence à lista!'
                        console.log(this.message)
                    }
                    else if(!ant)
                        head.next = p.next
                    else
                        ant.next = p.next
                    break
                case 'dupla':
                    head = this.listaDupla.head
                    // Busca a chave dentro da lista duplamente encadeada
                    p = head.next
                    while(p && p.key != this.key) 
                        p = p.next
                    if(!p)
                        this.message = "A chave buscada não pertence a esta lista duplamente encadeada"
                    else {
                        if(p.next)
                            p.next.last = p.last
                        p.last.next = p.next
                    }
                    break
                case 'circular':
                    head = this.listaCircular.head
                    // Busca a chave dentro da lista duplamente encadeada
                    p = head.next
                    while(p && p.key != this.key) 
                        p = p.next
                    if(!p)
                        this.message = "A chave buscada não pertence à esta lista circular"
                    else {
                        p.next.last = p.last
                        p.last.next = p.next
                    }
                    break;
                case 'fila':
                    head = this.fila.head
                    p = head.last
                    if(p == head) {
                        this.message = "A fila já se encontra vazia! Insira itens para poder deletar"
                        break 
                    }
                    p.last.next = p.next
                    head.last = p.last
                    break
                case 'pilha':
                    head = this.pilha.head
                    p = head.next    
                    if(p) 
                        head.next = p.next
                    else 
                        head.next = null
                    break
            }
            this.arrayUpdater(head)
            // Reseta o valor para impedir que o usuário insira o mesmo sem querer
            this.key = null
            if(this.selected != 'selecione')
                this.message = ''
        },
        validateChange() {
            if(this.selected != 'selecione')
                this.message = ''
            else
                this.message = 'Selecione uma opção de tipo de dado!'
            // Define se o input do numero deve ser impossibilitado 
            this.selected == 'fila' || this.selected == 'pilha' ? 
                this.readOnlyInput = true : this.readOnlyInput = false
            // Define que tipo de dado a cabeca vai referenciar para montar a array de impressão de dados
            switch(this.selected) {
                case 'simples':
                    head = this.listaLigada.head
                    break
                case 'dupla':
                    head = this.listaDupla.head
                    break
                case 'circular':
                    head = this.listaCircular.head
                    break
                case 'fila':
                    head = this.fila.head
                    break
                case 'pilha':
                    head = this.pilha.head
                    break
            }
            // Atualiza array 
            this.arrayUpdater(head)
        },
        updateButton() {
            this.inputDelete ? this.buttonMessage = 'Inserir' : this.buttonMessage = 'Deletar'
            this.inputDelete != this.inputDelete
        },
        mediator(e) {
            // Possibilita transformar o botão de inserir/deletar
            if(!this.inputDelete)
                this.push(e)
            else
                this.pop(e)
        },
        arrayUpdater(head) {
            // Atualização da Array de referência
            try {
                temp = head.next
                if(temp == head)
                    return
            } catch(e) {
                console.log(e.message)
                return
            }
            i = 1
            // Reseta a array
            this.arr.length = 0
            this.arr[0] = 'head'
            while(temp && temp != head) {
                this.arr[i] = temp.key
                temp = temp.next
                i++
            }
        }
    }
})

app.mount('#app')

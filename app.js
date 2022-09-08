
const app = Vue.createApp({
    data() {
        return {
            showBooks: true,
            buttonMessage: 'Hide',
            title: 'The last empire',
            author: 'Brandon Sanderson',
            age: 45,
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
        this.listaDupla.next = this.listaDupla.head
        this.listaDupla.last = this.listaDupla.head
    },
    methods: {
        push(e) {
            console.log(this.selected)
            var head = null
            switch(this.selected) {
                case '':
                case 'selecione':
                    this.message = 'Selecione uma opção de tipo de dado!'
                    console.log(this.message)
                    break;
                case 'simples':
                case 'fila':
                    // Inserção em Lista Ligada com Cabeça
                    this.selected == 'simples' ? head = this.listaLigada.head : head = this.fila.head
                    newNode = {
                        key: this.key,
                        next: head.next
                    }
                    head.next = newNode
                    this.listaLigada.count++
                    break;
                case 'dupla':
                    head = this.listaDupla.head
                    newNode = {
                        key: key,
                        next: null,
                        last: head
                    }
                    newNode.next = head.next
                    if(head.next)
                        head.next.last = newNode
                    head.next = newNode
                    break
                case 'circular':
                case 'pilha':
                    this.selected == 'circular' ? head = this.listaCircular.head : head = this.pilha.head
                    head = this.listaCircular.head
                    var newNode = {
                        key: key,
                        next: head.next,
                        last: head
                    }
                    head.next.last = newNode
                    head.next = newNode
                    break
            }
            // Atualização da Array de referência
            temp = head.next
            i = 0
            while(temp) {
                this.arr[i] = temp.key
                temp = temp.next
                i++
            }
            // Reseta o valor para impedir que o usuário insira o mesmo sem querer
            this.key = null
            if(this.selected != 'selecione')
                this.message = ''
        },
        pop() {
            
        },
        validateChange() {
            if(this.selected != 'selecione')
                this.message = ''
        }
    }
})

app.mount('#app')

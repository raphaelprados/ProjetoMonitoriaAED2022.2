
const app = Vue.createApp({
    data() {
        return {
            inputDelete: false,
            readOnlyInput: false,
            buttonMessage: 'Inserir',
            cleanBtnColor: 'white',
            cleanBtnText: 'black',
            direction: 'vertical',
            checked: false,
            message: '',
            selected: 'selecione',
            selectedNode: null,
            nodeKeyHolder: -1,
            key: '',
            listaLigada: {count: 0, head: {key: null, next: null}},
            listaDupla: {count: 0, head: {key: null, next: null, last: null}},
            listaCircular: {count: 0, head: {key: null, next: null, last: null}},
            pilha: {count: 0, head: {key: null, next: null}},
            fila: {count: 0, head: {key: null, next: null, last: null}},
            arr: [],
            neighboorNodes: [],
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
                    }
                    else if(!ant)
                        head.next = p.next
                    else
                        ant.next = p.next
                    this.listaLigada.count--
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
                    this.listaDupla.count--
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
                    this.listaCircular.count--
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
                    this.pilha.count--
                    break
                case 'pilha':
                    head = this.pilha.head
                    p = head.next    
                    if(p) 
                        head.next = p.next
                    else 
                        head.next = null
                    this.fila.count--
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
                    dataStructure = this.listaLigada
                    break
                case 'dupla':
                    dataStructure = this.listaDupla
                    break
                case 'circular':
                    dataStructure = this.listaCircular
                    break
                case 'fila':
                    dataStructure = this.fila
                    break
                case 'pilha':
                    dataStructure = this.pilha
                    break
            }
            // Define a cor do botão de esvaziar a estrutura de dados
            this.updateClearBtn(dataStructure)
            // Atualiza array 
            this.arrayUpdater(dataStructure.head)
        },
        updateButton() {
            this.inputDelete ? this.buttonMessage = 'Inserir' : this.buttonMessage = 'Deletar'
            this.inputDelete != this.inputDelete
        },
        selectNode(nodeValue) {
            this.selectedNode = null
            head = null
            temp = null
            // Garante que o evento não ocorre se o usuário clicar no botão da cabeça
            if(nodeValue == 'head') {
                this.selected == 'simples' ? head = this.listaLigada.head :
                        this.selected == 'pilha' ? head = this.pilha.head : head = this.listaDupla.head
                this.selectedNode = {key: null, next: head.next ? head.next.key : 'null'}
                if(this.selected == 'dupla' || this.selected == 'fila')
                    this.selectedNode.last = head.last ? head.last.key : 'null'
            } 
            // Pesquisa do nó nas estruturas de dados
            switch(this.selected) {
                case 'pilha':
                case 'simples':
                case 'dupla':
                    this.selected == 'simples' ? head = this.listaLigada.head :
                        this.selected == 'pilha' ? head = this.pilha.head : head = this.listaDupla.head
                    temp = head.next
                    while(temp && temp.key != nodeValue) 
                        temp = temp.next
                    break
                case 'fila':
                case 'circular':
                    this.selected == 'fila' ? head = this.fila.head : head = this.listaCircular.head
                    temp = head.next
                    while(temp != head && temp.key != nodeValue) 
                        temp = temp.next
                    break
            }
            if(temp != null) 
                this.selectedNode = {
                    key: temp.key, 
                    next: temp.next ? temp.next.key : null,
                    last: this.selected != 'pilha' && this.selected != 'simples' && temp.last ? temp.last.key : null
                }
            else
                return null
                
        },
        mediator(e) {
            // Possibilita transformar o botão de inserir/deletar
            if(!this.inputDelete)
                this.push(e)
            else
                this.pop(e)
        },
        arrayUpdater(head) {
            dataStructure = null
            // Atualização da Array de referência
            try {
                temp = head.next
                if(temp == head)
                    return
            } catch(e) {
                console.log(e.message)
                return
            }
            i = 0
            // Reseta a array
            this.arr.length = 0
            while(temp && temp != head) {
                this.arr[i] = temp.key
                temp = temp.next
                i++
            }   
            if(this.selected == 'fila')
                this.arr.reverse()
            switch(this.selected) {
                case 'simples':
                    this.arr.unshift('head')
                    this.arr.push('null')
                    dataStructure = this.listaLigada
                    break
                case 'circular':
                    this.listaCircular.count == 0 ? this.arr.push('head') : this.arr.unshift('head')
                    dataStructure = this.listaCircular
                    break
                case 'dupla':    
                    this.arr.unshift('head')
                    this.arr.unshift('null_a')
                    this.arr.push('null_b')
                    dataStructure = this.listaDupla
                    break
                case 'fila':
                    this.arr.unshift('inicio')
                    this.arr.push('fim')
                    dataStructure = this.fila
                    break
                case 'pilha':
                    this.arr.unshift('topo')
                    dataStructure = this.pilha
                    break
            }
            // Atualiza o botão de esvaziar estrutura de dado
            this.updateClearBtn(dataStructure)
        },
        pointerCall(ptr, node) {
            if(ptr == 1)
                this.selectNode(this.arr[this.arr.findIndex(element => element == node) + 1])
            else
                this.selectNode(this.arr[this.arr.findIndex(element => element == node)])
        },
        clean() {
            dataStructure = null
            switch(this.selected) {
                case 'simples':
                    this.listaLigada.head = head = {key: null, next: null}
                    this.listaLigada.count = 0
                    dataStructure = this.listaLigada
                    break
                case 'dupla':
                    this.listaDupla.head = {key: null, next: null, last: null}
                    this.listaDupla.count = 0
                    dataStructure = this.listaDupla
                    break
                case 'circular':
                    this.listaCircular.head = {key: null, next: null, last: null}
                    this.listaCircular.head.next = this.listaCircular.head
                    this.listaCircular.head.last = this.listaCircular.head
                    this.listaCircular.count = 0
                    dataStructure = this.listaCircular
                    break
                case 'pilha':
                    break    
                case 'fila':
                    break
            }
            this.updateClearBtn(dataStructure)
            this.arrayUpdater(dataStructure.head)
        },
        updateClearBtn(dataStructure) {
            if(dataStructure.count != 0) {
                this.cleanBtnColor = '#df626f'
                this.cleanBtnText = 'white'
            }
            else {
                this.cleanBtnColor = 'white'
                this.cleanBtnText = 'black'
            }
        }
    }
})

app.mount('#app')

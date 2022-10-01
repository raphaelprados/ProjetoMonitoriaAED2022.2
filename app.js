
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
            selectedNode: -1,
            nodeKeyHolder: -1,
            key: '',
            listaLigada: {count: 0, head: {key: 'head', next: null}},
            listaDupla: {count: 0, head: {key: 'head', next: null, last: null}},
            listaCircular: {count: 0, head: {key: 'head', next: null, last: null}},
            pilha: {count: 0, head: {key: null, next: null}},
            fila: {count: 0, head: {key: null, next: null, last: null}},
            arr: [],
            neighboorNodes: [],
            cur: null,
            selectedType: ''
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
            // Verifica se é um número
            if(this.key == '' || this.key == null)  {
                this.message = 'Insira um número!'
                return
            }
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
            // Atualiza o nodo selecionado nas informacoes de nodo após uma inserção
            this.selectNode(this.selectedNode != -1 ? this.selectedNode.key : -1)
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
            this.key = ''
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
            // Reseta o valor do no selecionado ao trocar de estrutura
            this.selectedNode = -1
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
            if(nodeValue == -1)
                return
            this.selectedNode = null
            head = null
            temp = null
            count = 0
            // Elimina os casos onde esses elementos são clicados na pilha e na fila
            if(nodeValue == 'topo' || nodeValue == 'inicio' || nodeValue == 'fim') {
                this.selectedNode = -1
                return
            }
            // Garante que o evento não ocorre se o usuário clicar no botão da cabeça
            if(nodeValue == 'head' && this.selected != 'circular') {
                this.selected == 'simples' ? head = this.listaLigada.head :
                        this.selected == 'pilha' ? head = this.pilha.head : head = this.listaDupla.head
                this.selectedNode = {key: 'head', next: head.next ? head.next.key : 'null'}
                if(this.selected == 'dupla' || this.selected == 'fila'  )
                    this.selectedNode.last = head.last ? head.last.key : 'null'
                return
            } 
            // Pesquisa do nó nas estruturas de dados
            switch(this.selected) {
                case 'pilha':
                case 'simples':
                case 'dupla':
                    this.selected == 'simples' ? head = this.listaLigada.head :
                        this.selected == 'pilha' ? head = this.pilha.head : head = this.listaDupla.head
                    temp = head.next
                    while(temp && temp.key != nodeValue)  {
                        temp = temp.next
                        count++
                    }
                    break
                case 'fila':
                case 'circular':
                    this.selected == 'fila' ? head = this.fila.head : head = this.listaCircular.head
                    temp = head.next
                    while(temp != head && temp.key != nodeValue) {
                        temp = temp.next
                        count++
                    }
                    break
            }
            // Criando o objeto de retorno 
            if(temp != null) {
                this.selectedNode = {
                    key: temp.key
                }
                if(this.selected != 'pilha' && this.selected != 'fila')
                    this.selectedNode.next = temp.next ? temp.next.key : null
                else
                    this.selectedNode.position = this.selected == 'pilha' ? count : this.arr.length - count - 3
                if(this.selected == 'dupla' || this.selected == 'circular')
                    this.selectedNode.last = temp.last ? temp.last.key : null
            }
            else
                this.selectedNode = 'null'    
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
            temp = head.next
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
        clickCall(ptr, node, e) {
            returnValue = null

            if(String(e.target.outerHTML).includes('ptr') || String(e.target.parentNode.outerHTML).includes('bi-arrow')) 
                this.selectedType = 'Ponteiro'
            else 
                this.selectedType = 'Nó'

            switch(ptr) {
                case -1:
                    this.selectNode(node)
                    break
                case 0:
                    this.selectNode(this.arr[this.arr.findIndex(element => element == node)])
                    break
                case 1:
                    this.selectNode(this.arr[this.arr.findIndex(element => element == node) + 1])
                    break
                case 2:
                    this.selectNode(this.listaCircular.head.last.key)
                    break
                case 3:
                    this.selectNode(this.listaCircular.head.key)
                    break
            }    
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
                    this.pilha.head = {key: null, next: null}
                    this.pilha.count = 0
                    dataStructure = this.pilha
                    break    
                case 'fila':
                    this.fila.head = {key: null, next: null, last: null}
                    this.fila.head.next = this.fila.head
                    this.fila.head.last = this.fila.head
                    this.fila.count = 0
                    dataStructure = this.fila
                    break
                /*
                pilha: {count: 0, head: {key: null, next: null}},
                fila: {count: 0, head: {key: null, next: null, last: null}},
                */
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
        },
        printPath() {
            array = []
            for(i = 0; i < this.listaCircular.count; i++)
                array[i] = 1
            return array
        }, 
        printRange() {
            return Math.ceil((100 * (listaCircular.count + 1) + 25 * (listaCircular.count + 2) + 42 - listaCircular.count * 4) / 12.5)
        }
    }
})

app.mount('#app')

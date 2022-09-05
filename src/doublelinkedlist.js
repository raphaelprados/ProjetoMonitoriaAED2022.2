
// Implementação de lista ligada duplamente encadeada com cabeça

let head = {
    key: null,
    next: null,
    last: null
}
head.next = null
head.last = null

function search(key) {
    var p = head.next

    while(p && p.key != key) 
        p = p.next
    return p
}

function toString() {
    var p = head.next
    var str = "h,"
    
    while(p) {
        str += (p.key + ",")
        p = p.next
    }
    str += "h"
    return str
}

function push(key) {
    var newNode = {
        key: key,
        next: null,
        last: head
    }
    newNode.next = head.next
    if(head.next)
        head.next.last = newNode
    head.next = newNode
}

function pop(key) {
    var p = search(key)

    if(!p)
        return false
    if(p.next)
        p.next.last = p.last
    p.last.next = p.next
    return true
}

function pop() {
    var p = head.next

    if(!p) {
        head.next = null
        return null
    }
    if(p.next)
        p.next.last = p.last
    p.last.next = p.next
    return p.key
}

push(2)
push(7)
push(11)
push(29)
console.log(toString())
pop()
pop()
console.log(toString())

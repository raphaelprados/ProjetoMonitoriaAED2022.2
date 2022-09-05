
// Implementação de lista ligada duplamente encadeada com cabeça

let head = {
    key: null,
    next: null,
    last: null
}
head.next = head
head.last = head

function search(key) {
    var p = head.next

    while(p != head && p.key != key) 
        p = p.next
    return p == head ? null : p;
}

function toString() {
    var p = head.next
    var str = "h,"
    
    while(p != head) {
        str += (p.key + ",")
        p = p.next
    }
    str += "h"
    return str
}

function push(key) {
    var newNode = {
        key: key,
        next: head.next,
        last: head
    }
    head.next.last = newNode
    head.next = newNode
}

function pop() {
    var p = head.last

    if(p == head) 
        return null
    head.last.last.next = head
    head.last = p.last

    return p.key
}

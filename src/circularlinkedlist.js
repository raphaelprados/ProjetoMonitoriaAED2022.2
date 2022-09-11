
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

function pop(key) {
    var p = search(key)

    if(!p)
        return false
    p.next.last = p.last
    p.last.next = p.next
}

function pop() {
    var p = head.next

    if(p == head) 
        return null
    p.next.last = p.last
    p.last.next = p.next
    return p.key
}


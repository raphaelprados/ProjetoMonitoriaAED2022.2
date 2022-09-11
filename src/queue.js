
// Implementação de uma fila com uma lista duplamente encadeada

let head = {
    key: null,
    start: null,
    end: null
}
head.start = head
head.end = head

function getEnd() {
    if(head.end != head)
        return head.end
}

function search(key) {
    var p = head.start

    while(p != head && p.key != key) 
        p = p.start
    return p == head ? null : p;
}

function toString() {
    var p = head.start
    var str = "h,"
    
    while(p != head) {
        str += (p.key + ",")
        p = p.start
    }
    str += "h"
    return str
}

function push(key) {
    var newNode = {
        key: key,
        start: head.start,
        end: head
    }
    head.start.end = newNode
    head.start = newNode
}

function pop() {
    var p = head.start

    if(p == head) 
        return null
    p.start.end = p.end
    p.end.start = p.start
    return p.key
}


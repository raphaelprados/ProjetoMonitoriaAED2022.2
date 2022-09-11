
// Implementação de lista ligada com cabeça

let head = {next: null, key: null}

function search(key) {
    var p = head.next

    while(p && p.key != key) 
        p = p.next
    return p
}

function toString() {
    var p = head.next
    var str = "h->"
    
    while(p) {
        str += (p.key + "->")
        p = p.next
    }
    str += "null"
    return str
}

function push(key) {
    var newNode = {
        key: key,
        next: head.next,
    }
    head.next = newNode
}

function pop(key) {
    var p = head.next
    var ant = null
    
    while(p && p.key != key) {
        ant = p
        p = p.next
    }

    if(!p)
        return false
    else if(!ant)
        head.next = p.next
    else
        ant.next = p.next
    return true
}

function pop() {
    var p = head.next
    
    if(p) {
        head.next = p.next
        return p.key
    }
    head.next = null
    return null
}


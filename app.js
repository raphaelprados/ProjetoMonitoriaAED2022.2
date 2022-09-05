const app = Vue.createApp({
    data() {
        return {
            showBooks: true,
            buttonMessage: 'Hide',
            title: 'The last empire',
            author: 'Brandon Sanderson',
            age: 45
        }
    },
    methods: {
        changeTitle(title) {
            if (this.title == 'Words of Radiance')
                this.title = 'The Last Empire'
            else
                this.title = 'Words of Radiance'
        },
        toogleShowBooks() {
            this.showBooks = !this.showBooks
        },
        handleEvent(event) {
            console.log(event)
        }
    }
})

app.mount('#app')

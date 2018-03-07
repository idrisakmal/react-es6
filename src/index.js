class Component {
    constructor() {
        this.state = {}
        this.listeners = []
    }

    setState(nextState) {
        Object.assign(this.state, nextState)
        this.flush()
    }

    subscribe(listener) {
        this.listeners.push(listener)
        this.flush()
    }

    flush() {
        const htmlString = this.render();
        this.listeners.forEach(listener => {
            listener(htmlString)
        })
    }

    render() {
        return null;
    }
}

class DOM {
    static render(component, node) {
        component = new component();
        component.subscribe(htmlString => {
            node.innerHTML = htmlString
        })
    }
}

class Counter extends Component {
    constructor() {
        super()
        this.state = {
            count: 0
        }
    }

    render() {
        return `
            <button onclick=${this.handleDecrement}>-</button><h1>${this.state.count}</h1><button onclick=${this.handleIncrement}>+</button>
        `
    }

    handleDecrement = (event) => {
        debugger
    }

    handleIncrement = (event) => {
        debugger
    }
}

DOM.render(Counter, document.getElementById('app'))
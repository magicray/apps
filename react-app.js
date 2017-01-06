/* Micro framework for building react based applications */
class App extends React.Component {
    constructor(props) {
        super(props)

        this.actions = {
            render: (route) => {
                this.route = route
                this.setState(this.state)
            }
        }

        this.state = JSON.parse(JSON.stringify(props.state))

        const setState = (state) => this.setState(state)
        const getState = () => this.state
        
        for(let k in this.props.reducers) {
            if(!this.props.reducers.hasOwnProperty(k))
                continue

            const s = k.split('_')
            
            if('PromisePending' === s.pop() && s !== k) {
                k = s.join('_')

                const pending = this.props.reducers[k + '_PromisePending']
                const resolved = this.props.reducers[k + '_PromiseResolved']
                const rejected = this.props.reducers[k + '_PromiseRejected']
                
                this.actions[k] = function(promise) {
                    const state = getState()

                    try {
                        pending(state)
                        setState(state)

                        promise.then(r => {    
                            const state = getState()

                            try {
                                resolved(state, r)
                                setState(state)
                            } catch(e) {
                                console.log(resolved.name, state, e)
                            }
                        }).catch(e => {
                            const state = getState()

                            try {
                                rejected(state, e)
                                setState(state)
                            } catch(e) {
                                console.log(rejected.name, state, e)
                            }
                        })
                    } catch(e) {
                        console.log(e)
                    }
                }
            } else {
                const reducer = this.props.reducers[k]

                this.actions[k] = function() {
                    const state = getState()
                    
                    try {
                        reducer(state, ...arguments)
                        setState(state)
                    } catch(e) {
                        console.log(reducer.name, arguments, state, e)
                    }
                }
            }
        }
        
        console.log('initialized')
    }

    render() {
        return this.props.router(this.route, {
                state: this.state,
                actions: this.actions})
    }

    static mount(props) {
        let div = document.getElementById(props.div)

        if(props.div === undefined) {
            div = document.createElement('div')
            document.body.appendChild(div)
        }

        ReactDOM.render(React.createElement(App, props), div)
    }
}

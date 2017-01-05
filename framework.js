/* Micro framework for building react based applications */
class App extends React.Component {
    constructor(props) {
        super(props)

        this.href = document.createElement('a')

        if(props.div === undefined) {
            this.href = window.location
        }

        this.actions = {
            changeView: (location) => {
                this.href = location

                if(props.div === undefined) {
                    window.location = this.href
                }

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
        const component = this.props.views[this.href.hash] || this.props.home

        return React.createElement(component, {
                actions: this.actions,
                state: this.state
            })
    }

    static mount(props) {
        let div = document.getElementById(props.div)

        if(props.div === undefined) {
            div = document.createElement('div')
            document.body.appendChild(div)
            div.id = Date.now()
        }

        ReactDOM.render(React.createElement(App, props), div)
    }
}

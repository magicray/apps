class App extends React.Component {
    constructor(props) {
        super(props)

        this.href = document.createElement('a')
        this.href = window.location

        this.actions = {
            changeView: (location) => {
                this.href = location
                console.log('changeView', location, this.state)
                this.setState(this.state)
            }
        }
        this.state = JSON.parse(JSON.stringify(props.state))

        const setState = (state) => this.setState(state)
        const getState = () => JSON.parse(JSON.stringify(this.state))
        const m = ['PromisePending', 'PromiseResolved', 'PromiseRejected']
        
        for(let k in this.props.reducers) {
            if(!this.props.reducers.hasOwnProperty(k))
                continue

            const s = k.split('_')
            
            if(m.indexOf(s.pop()) > -1 && s !== k) {
                k = s.join('_')

                const pending = this.props.reducers[k + '_' + m[0]]
                const resolved = this.props.reducers[k + '_' + m[1]]
                const rejected = this.props.reducers[k + '_' + m[2]]
                
                this.actions[k] = function(promise) {
                    const state = getState()
                    try {
                        console.log(pending.name, null, state)
                        pending(state)
                        setState(state)

                        promise.then(r => {    
                            const state = getState()
                            try {
                                console.log(resolved.name, r, state)
                                resolved(state, r)
                                setState(state)
                            } catch(e) {
                                console.log(e)
                            }
                        }).catch(e => {
                            const state = getState()
                            try {
                                console.log(rejected.name, e, state)
                                rejected(state, e)
                                setState(state)
                            } catch(e) {
                                console.log(e)
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
                        console.log(reducer.name, arguments, state)
                        reducer(state, ...arguments)
                        setState(state)
                    } catch(e) {
                        console.log(e)
                    }
                }
            }
        }
        
        console.log('initialized')
    }

    render() {
        const component = this.props.views[this.href.hash] || this.props.home

        console.log(this.href.hash, this.state)
        return React.createElement(component, {
                actions: this.actions,
                state: JSON.parse(JSON.stringify(this.state))
            })
    }

    static stringify(obj) {
        return JSON.stringify(obj, null, 4)
    }
}

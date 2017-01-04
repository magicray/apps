class App extends React.Component {
    constructor(props) {
        super(props)

        this.actions = {}
        this.state = JSON.parse(JSON.stringify(props.state))

        const setState = (state) => this.setState(state)
        const getState = () => JSON.parse(JSON.stringify(this.state))
        const m = ['PromisePending', 'PromiseResolved', 'PromiseRejected']
        
        for(let k in this.props.reducers) {
            const s = k.split('_')
            
            if(m.indexOf(s.pop()) > -1 && s !== k) {
                k = s.join('_')

                const pending = this.props.reducers[k + '_' + m[0]]
                const resolved = this.props.reducers[k + '_' + m[1]]
                const rejected = this.props.reducers[k + '_' + m[2]]
                
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
                                console.log(e)
                            }
                        }).catch(e => {
                            const state = getState()
                            try {
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

    componentDidMount() {
        window.onhashchange = () => this.setState({})
    }

    render() {
        const parser = document.createElement('a')
        parser.href = window.location

        const component = this.props.pages[parser.hash] || this.props.home

        return React.createElement(component, {
                actions: this.actions,
                state: JSON.parse(JSON.stringify(this.state))
            })
    }

    static stringify(obj) {
        return JSON.stringify(obj, null, 4)
    }
}

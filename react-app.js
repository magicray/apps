class AppClass extends React.Component {
    constructor(props) {
        super(props)

        const setView = (view) => this.view = view? view: this.view
        const getState = () => this.state
        const setState = (state) => this.setState(state)
        const getAction = (action) => this.props.actions[action]

        this.view = () => React.DOM.h1(null, 'Loading')
        this.state = JSON.parse(JSON.stringify(props.state))

        this.actions = {}

        for(let k in this.props.actions) {
            const reducer = this.props.actions[k]

            this.actions[k] = function() {
                const state = getState()

                try {
                    const ret = reducer.apply(state, arguments)

                    if('object' === typeof(ret)) {
                        const promise = ret
                        const pending = getAction(k + '_PromisePending')
                        const resolved = getAction(k + '_PromiseResolved')
                        const rejected = getAction(k + '_PromiseRejected')

                        try {
                            setView(pending.apply(state))
                            setState(state)

                            promise.then(r => {
                                const state = getState()

                                try {
                                    setView(resolved.apply(state, [r]))
                                    setState(state)
                                } catch(e) {
                                    console.log(resolved.name, state, e)
                                }
                            }).catch(e => {
                                const state = getState()

                                try {
                                    setView(rejected.apply(state, [e]))
                                    setState(state)
                                } catch(e) {
                                    console.log(rejected.name, state, e)
                                }
                            })
                        } catch(e) {
                            console.log(e)
                        }
                    } else {
                        setView(ret)
                        setState(state)
                    }
                } catch(e) {
                    console.log(reducer.name, arguments, state, e)
                }
            }
        }

        console.log('initialized')
    }

    componentDidMount() {
        const a = document.createElement('a')

        window.onhashchange = () => {
            a.href = window.location
            this.actions[a.hash.slice(2)]()
        }

        a.href = window.location
        const action = a.hash? a.hash.slice(2): this.props.onload
        this.actions[action]()
    }

    render() {
        return React.createElement(this.view, {
            state: this.state,
            actions: this.actions})
    }
}

function App(onload, state, divId) {
    return {
        render: function(props) {
            return React.createElement(AppClass, props)
        },

        mount: function(divId) {
            let div = document.getElementById(divId)

            if(undefined === divId) {
                div = document.createElement('div')
                document.body.appendChild(div)
            }

            ReactDOM.render(
                React.createElement(this.render, {
                    state, onload, actions: this}),
                div)
        }
    }
}

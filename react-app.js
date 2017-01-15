class AppClass extends React.Component {
    constructor(props) {
        super(props)

        const getState = () => this.state
        const setState = (state) => this.setState(state)
        const getAction = (action) => this.props.actions[action]

        this.state = {
            view: () => React.DOM.h1(null, 'Loading'),
            state: JSON.parse(JSON.stringify(props.state))
        }

        this.actions = {}

        for(let k in this.props.actions) {
            const reducer = this.props.actions[k]

            this.actions[k] = function() {
                const state = getState()

                try {
                    const promise = reducer.apply(state, arguments)
                    setState(state)

                    if(promise) {
                        promise.then(val => {
                            const state = getState()
                            getAction(k + '_PromiseResolved').apply(
                                state, [val])
                            setState(state)
                        }).catch(val => {
                            const state = getState()
                            getAction(k + '_PromiseRejected').apply(
                                state, [val])
                            setState(state)
                        })
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
        return React.createElement(this.state.view, {
            state: this.state.state,
            actions: this.actions})
    }
}

function App(state) {
    return {
        render: function(props) {
            return React.createElement(AppClass, props)
        },

        mount: function(onload, divId) {
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

function App(state) {
    let root = null
    const routes = {}

    class Root extends preact.Component {
        componentDidMount() {
            root = this
            window.onhashchange = () => this.setState({})
        }

        render() {
            const a = document.createElement('a')
            a.href = window.location
            return routes[a.hash? a.hash: '']
        }
    }

    function h(component, param) {
        return ('string' === typeof(component))?
               preact.h(...arguments):
               preact.h(component, {state, actions, param, h})
    }

    const actions = {
        route(hash, component) {
            component? routes[hash] = h(component): routes[''] = h(hash)
        },

        render(div) {
            Object.entries(this).map(([k, v]) => {
                this[k] = function() {
                    v.apply(state, arguments)
                    root.setState({})
                }
            })

            return div? preact.render(preact.h(Root), div): preact.h(Root)
        }
    }

    return actions
}

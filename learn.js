class Log extends React.Component {
    render() {
        const onClick = () => {
            Log.logs = []
            this.setState({})
        }

        return React.DOM.div(null,
                    React.DOM.pre(null, Log.logs.slice(-25).join('\n')),
                    React.createElement(ReactBootstrap.Button,
                        {onClick}, 'RESET'))
    }

    static log(msg) {
        const d = new Date(Date.now())
        const y = d.getFullYear()
        const mon = d.getMonth()+1
        const day = d.getDate()
        const h = d.getHours()
        const min = d.getMinutes()
        const s = d.getSeconds()
        const msec = d.getMilliseconds()

        Log.count += 1
        const c = Log.count

        const logmsg = `${c}.${y}${mon}${day}.${h}${min}${s}.${msec} : ${msg}`

        console.log(logmsg)
        Log.logs.push(logmsg)
    }
}
Log.logs = []
Log.count = 0

class GPS extends React.Component {
    componentDidMount() {
        GPS.updateLoc()
    }

    render() {
        const onClick = (e) => {
            if ('Show Address' === this.props.state.gps.action) {
                GPS.updateAddr(this.props.state.gps.coords)
            } else {
                GPS.updateLoc()
            }
        }

        const r = ReactBootstrap
        const e = React.createElement

        return React.DOM.div(null,
                    React.DOM.pre(null, this.props.state.gps.val),
                    e(r.Button, {onClick}, this.props.state.gps.action))
    }

    static updateLoc() {
        App.dispatchPromise('fetchLocation', new Promise(resolve => {
            navigator.geolocation.getCurrentPosition((pos) => {
                resolve(pos.coords)})
        }))
    }

    static updateAddr(coords) {
        const maps = 'https://maps.googleapis.com/maps/api/geocode/json?';
        const latlng = coords.latitude + ',' + coords.longitude;

        App.dispatchPromise(
            'fetchAddress',
            axios.get(`${maps}latlng=${latlng}`))
    }
}

function Text(props) {
    const processedText = props.state.flag ? 
                          props.state.text.split('').reverse().join('') :
                          props.state.text

    const textProps = {
        type: 'text',
        value: props.state.text,
        onChange: e => props.updateText(e.target.value)
    }

    const buttonProps = {
        bsStyle: 'primary',
        onClick: props.toggleText
    }

    const r = ReactBootstrap
    const e = React.createElement

    return e(r.Form, null,
        e(r.FormGroup, null,
            e(r.FormControl, textProps),
            e(r.ControlLabel, null, processedText),
            e(r.ButtonToolbar, null,
                e(r.Button, buttonProps, 'Toggle'))))
}

function Props(props) {
    return React.DOM.pre(null, JSON.stringify(props, null, 4))
}

function Home(props) {
    return React.createElement(
        ReactBootstrap.Jumbotron, null,
            React.DOM.h1(null, 'React Application'))
}

App.pages = function() {
    const b = ReactBootstrap
    const e = React.createElement

    function Menu(props) {
        const onClick = e => window.location = e.target

        return e(b.Navbar, {collapseOnSelect: true},
                e(b.Navbar.Header, null,
                    e(b.Navbar.Brand, null,
                        React.DOM.a({href: '#', onClick}, 'Learn React')),
                    e(b.Navbar.Toggle)),
                e(b.Navbar.Collapse, null,
                    e(b.Nav, null,
                        e(b.NavItem, {href: '#/Text', onClick}, 'Text'),
                        e(b.NavItem, {href: '#/Props', onClick}, 'Props'),
                        e(b.NavItem, {href: '#/GPS', onClick}, 'GPS'),
                        e(b.NavItem, {href: '#/Logs', onClick}, 'Logs'))))
    }

    function page(component) {
        return props => {
            return React.DOM.div(null,
                e(Menu, props),
                e(ReactBootstrap.Grid, null,
                    e(component, props)))
        }
    }

    const pages = {
        '#/Text': page(Text),
        '#/Props': page(Props),
        '#/GPS': page(GPS),
        '#/Logs': page(Log)
    }

    return {default: page(Home), pages}
}

App.state = {
    text: 'Hello World',
    flag: true,
    gps: {}
}

App.r.fetchLocation_PromisePending = function(state) {
    state.gps.val = 'Fetching Location'
    state.gps.action = 'Show Location'
}

App.r.fetchLocation_PromiseResolved = function(state, coords) {
    state.gps = {
        coords,
        action: 'Show Address',
        val: App.stringify({
            latitude: coords.latitude,
            longitude: coords.longitude,
            accuracy: coords.accuracy})}
}

App.r.fetchAddress_PromisePending = function(state) {
    state.gps.val = 'Fetching Address'
}

App.r.fetchAddress_PromiseResolved = function(state, response) {
    state.gps.action = 'Show Location'
    state.gps.val = response.data.results[0]['formatted_address'].replace(
        /, */g, '\n')
}

App.r.fetchAddress_PromiseRejected = function(state, error) {
   state.gps.val = App.stringify(error)
   state.gps.action = 'Show Address'
}

App.r.updateText = function(state, text) {
    state.text = text
}

App.r.toggleText = function(state) {
    state.flag = state.flag? false: true
}

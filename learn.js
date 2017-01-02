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
        GPS.updateLoc(this.props.updateLocation)
    }

    render() {
        const onClick = (e) => {
            if ('Show Address' === this.props.state.gps.action) {
                GPS.updateAddr(
                    this.props.state.gps.coords,
                    this.props.updateAddress)
            } else {
                GPS.updateLoc(this.props.updateLocation)
            }
        }

        const state = this.props.state
        const val = state.gps && state.gps.val || 'Fetching'
        const action = state.gps && state.gps.action || 'WAIT'

        const r = ReactBootstrap
        const e = React.createElement

        return React.DOM.div(null,
                    React.DOM.pre(null, val),
                    e(r.Button, {onClick}, action))
    }

    static updateLoc(action) {
        navigator.geolocation.getCurrentPosition((pos) => {
            action(pos.coords)
        })
    }

    static updateAddr(coords, action) {
        const maps = 'https://maps.googleapis.com/maps/api/geocode/json?';
        const latlng = coords.latitude + ',' + coords.longitude;

        fetch(`${maps}latlng=${latlng}`).then(response => {
            response.json().then(d => {
                action(d.results[0]['formatted_address'].replace(
                    /, */g, '\n'))
            });
        });
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

App.r.updateText = function(state, text) {
    state.text = text
}

App.r.toggleText = function(state) {
    state.flag = state.flag? false: true
}

App.r.updateLocation = function(state, coords) {
    state.gps = {
        coords,
        action: 'Show Address',
        val: JSON.stringify({
            latitude: coords.latitude,
            longitude: coords.longitude,
            accuracy: coords.accuracy}, null, 4)}
}

App.r.updateAddress = function(state, addr) {
    state.gps.action = 'Show Location'
    state.gps.val = addr
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
                    e(b.Nav, {bsStyle: 'tabs'},
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

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
    constructor(props) {
        super(props)

        this.state = {
            val: this.props.val,
            loc: '',
            action: 'Show Location'
        }
        Log.log('GPS.constructor()')
    }

    componentDidMount() {
        Log.log('Retrieving the location')
        navigator.geolocation.getCurrentPosition((pos) => {
            Log.log('Location retrived')
            const loc = pos.coords;
            this.setState({
                loc: loc,
                action: 'Show Address',
                val: JSON.stringify({
                    latitude: loc.latitude,
                    longitude: loc.longitude,
                    accuracy: loc.accuracy}, null, 4)});
        });
    }

    showAddress() {
        const maps = 'https://maps.googleapis.com/maps/api/geocode/json?';
        const latlng = this.state.loc.latitude + ',' + this.state.loc.longitude;

        Log.log('Retrieving the address')
        fetch(`${maps}latlng=${latlng}`).then(response => {
            response.json().then(d => {
                Log.log('Address retrieving')
                this.setState({
                    action: 'Show Location',
                    val: d.results[0]['formatted_address'].replace(
                        /, */g, '\n')});
            });
        });
    }

    render() {
        const onClick = (e) => {
            if ('Show Address' === this.state.action) {
                this.showAddress()
            } else {
                this.setState({
                    loc: this.state.loc,
                    action: 'Show Address',
                    val: JSON.stringify({
                        latitude: this.state.loc.latitude,
                        longitude: this.state.loc.longitude,
                        accuracy: this.state.loc.accuracy}, null, 4)});
            }
        }

        const r = ReactBootstrap
        const e = React.createElement

        return React.DOM.div(null,
                    React.DOM.pre(null, this.state.val),
                    e(r.Button, {onClick}, this.state.action))
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

App.reducers = {
    updateText: function(state, action) {
        state.text = action.text
    },

    toggleText: function(state, action) {
        state.flag = state.flag? false: true
    }
}

App.actions = {
    updateText: function(text) {
        return {text}
    },

    toggleText: function() {
        return {}
    }
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

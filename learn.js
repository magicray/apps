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

function TextView(props) {
    const onClick = e => props.onClick()
    const onChange = e => props.onChange(e.target.value)

    const r = ReactBootstrap
    const e = React.createElement

    return e(r.Form, null,
        e(r.FormGroup, null,
            e(r.FormControl, {
                type: 'text',
                value: props.text,
                onChange}),
            e(r.ControlLabel, null, props.processed),
            e(r.ButtonToolbar, null,
                e(r.Button, {bsStyle: 'primary', onClick}, 'Toggle'))))
}

class Text extends React.Component {
    constructor(props) {
        super(props)
        Log.log('Text.constructor()')
    }
    render() {
        let {text, flag} = this.props.state

        return TextView({
            text,
            processed: flag? text.split('').reverse().join(''): text,
            onChange: this.props.updateText,
            onClick: this.props.toggleText
        })
    }
}

function Props(props) {
    return React.DOM.pre(null, JSON.stringify(props, null, 4))
}

function Home(props) {
    return React.createElement(
        ReactBootstrap.Jumbotron, null,
            React.DOM.h1(null, 'React Application'))
}

App.r.updateText = (state, action) => {
    state.text = action.text
}

App.r.toggleText = (state, action) => {
    state.flag = state.flag? false: true
}

App.a.updateText = (text) => { return {
    type: 'updateText',
    text
}}

App.a.toggleText = () => { return {
    type: 'toggleText'
}}

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

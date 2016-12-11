const GPS = React.createFactory(class extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            val: this.props.val,
            loc: '',
            action: 'Show Location'
        };
    }

    componentDidMount() {
        this.showLocation();
    }


    showAddress() {
        const maps = 'https://maps.googleapis.com/maps/api/geocode/json?';
        const latlng = this.state.loc.latitude + ',' + this.state.loc.longitude;

        fetch(`${maps}latlng=${latlng}`).then(response => {
            response.json().then(d => {
                this.setState({
                    action: 'Show Location',
                    val: d.results[0]['formatted_address'].replace(
                        /, */g, '\n')});
            });
        });
    }

    onClick(e) {
        if ('Show Location' === this.state.action) {
            this.showLocation();
        } else {
            this.showAddress();
        }
    }

    showLocation() {
        navigator.geolocation.getCurrentPosition((pos) => {
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

    render() {
        const DIV = React.createFactory('div');
        const PRE = React.createFactory('pre');
        const BUTTON = React.createFactory('button');

        return DIV({className: 'col-sm-4'},
                   PRE({style: {'white-space': 'pre-wrap'}}, this.state.val),
                   BUTTON({onClick: e => this.onClick(e)}, this.state.action));
    }
});


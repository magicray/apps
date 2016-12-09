class GPS extends React.Component {
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
        var maps = 'https://maps.googleapis.com/maps/api/geocode/json?';
        var latlng = this.state.loc.latitude + ',' + this.state.loc.longitude;
        var url = maps + 'latlng=' + latlng;

        axios.get(url).then((response) => {
            this.setState({action: 'Show Location',
                val: response.data.results[0]['formatted_address'].replace(
                    /, */g, '\n')});
        }).catch(function(error){
            alert(error);
        })
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
            var loc = pos.coords;
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
        return (
            <div className="col-sm-4">
                <pre style={{'white-space': 'pre-wrap'}}>
                    {this.state.val}
                </pre>

                <button onClick={(e) => this.onClick(e)}>
                    {this.state.action}
                </button>
            </div>);
    }
}

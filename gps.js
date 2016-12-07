var GPS =  React.createFactory(React.createClass({
    getInitialState: function() {
        return {val: this.props.val, loc: '', action: 'Show Location'}
    },

    componentDidMount: function() {
        this.showLocation();
    },


    showAddress: function() {
        var that = this;

        var maps = 'https://maps.googleapis.com/maps/api/geocode/json?';
        var latlng = this.state.loc.latitude + ',' + this.state.loc.longitude;
        var url = maps + 'latlng=' + latlng;

        axios.get(url).then(function(response) {
            that.setState({action: 'Show Location',
                val: response.data.results[0]['formatted_address'].replace(
                    /, */g, '\n')});
        }).catch(function(error){
            alert(error);
        })
    },

    onClick: function() {
        if ('Show Location' === this.state.action) {
            this.showLocation();
        } else {
            this.showAddress();
        }
    },

    showLocation: function () {
        var that = this;

        navigator.geolocation.getCurrentPosition(function (pos) {
            loc = pos.coords;
            that.setState({
                loc: loc,
                action: 'Show Address',
                val: JSON.stringify({
                    latitude: loc.latitude,
                    longitude: loc.longitude,
                    accuracy: loc.accuracy}, null, 4)});
        });
    },

    render: function() {
        var PRE = React.createFactory('pre');
        var DIV = React.createFactory('div');
        var BUTTON = React.createFactory('button');

        return DIV({className: 'col-sm-2'},
                   PRE(null, this.state.val),
                   BUTTON({onClick: this.onClick}, this.state.action));
    }
}));

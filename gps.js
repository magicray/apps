var GPS = (function () {

var PRE = React.createFactory('pre');
var DIV = React.createFactory('div');
var BUTTON = React.createFactory('button');


return React.createFactory(React.createClass({
    getInitialState: function() {
        return {obj: this.props.obj}
    },

    componentDidMount: function () {
        this.refresh();
    },

    refresh: function() {
        var that = this;

        that.setState({obj: 'Refreshing..'});

        navigator.geolocation.getCurrentPosition(function (pos) {
            that.setState({obj: {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                accuracy: pos.coords.accuracy}});
        });
    },

    render: function() {
        var text = JSON.stringify(this.state.obj, null, 4);

        return DIV({className: 'col-sm-2'},
                   PRE(null, text),
                   BUTTON({onClick: this.refresh}, 'Refresh'));
    }}));
})();

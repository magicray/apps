function GPS(root) {

var PRE = React.createFactory('pre');
var DIV = React.createFactory('div');


var JSONView = React.createFactory(React.createClass({
    render: function() {
        return PRE(null,
                   JSON.stringify(this.props.obj, null, 4));
    }}));

var APP = React.createFactory(React.createClass({
    render: function() {
        return DIV(null,
                   JSONView({obj: this.props.coords}, null));
    }}));

navigator.geolocation.getCurrentPosition(function (pos) {
    var coords = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy};

    ReactDOM.render(APP({coords: coords}, null), root);
});
}

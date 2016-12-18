import Ember from 'ember';
/**
 * @module  components
 * @class   web-socket
 */
export default Ember.Component.extend({
  classNames: ['webSocket'],
  socketService: Ember.inject.service('websockets'),
  initializeWebsocket: function() {
    var socket = this.get('socketService').socketFor("ws://some-socket.heroku.com/");
    socket.on('open', this.webSocketConnectionOpened, this);
    socket.on('message', this.webSocketMessageRecieved, this);
    socket.on('close', function(event) {
      if (!this.isDestroying && !this.isDestroyed) {
        Ember.run.later(this, function() {
          socket.reconnect();
        }, 1000);
      }
    }, this);
  }.on('didInsertElement'),
  webSocketConnectionOpened: function(event) {

    console.log('On open event has been called: ', event);
    var socket = this.get('socketService').socketFor("ws://some-socket.heroku.com//");
    socket.send("hey")
  },
  webSocketMessageRecieved: function(event) {

    console.log("server says", event)

  },
  webSocketSendMessage: function(message) {
    var socket = this.get('socketService').socketFor(this.get('socketUrl'));
    console.log(this.formatMessage(message))
    socket.send(this.formatMessage(message))
  },
  formatMessage: function(message) {
    return JSON.stringify(
      {
        "message": message.key,
        "content": message.content
      }
    )
  },
  handleDeviceRefreshRequest: function(req) {
    if (req.targetId === "all" || req.targetId === storage.getItem('websocketId')) {
      console.log(storage.getItem('websocketId'),req.targetId)
      return this.dispatchAction('refresh');
    }
    return false;
  },
  willDestroyElement() {
    var socket = this.get('socketService').socketFor("ws://some-socket.heroku.com//");
    socket.off()
  }
});

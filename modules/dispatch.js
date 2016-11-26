"use strict";

const sockets = {};
const dispatch = {};

module.exports = {

  init: function(io) {
    io.on('connection', function (socket) {
      socket.emit('identify', {});
      socket.on('identify', user => {
        sockets[user.userId] = socket;
        console.log('connected: ', user);
      });
    });
  },

  emit: function(userId, data) {
    let socket = sockets[userId];
    if(socket) {
      console.log('dispatching', userId, data);
      return sockets[userId].emit('update', data);
    } else {
      console.log('No socket found for ', userId);
      console.log(sockets);
      return null;
    }
  }
};

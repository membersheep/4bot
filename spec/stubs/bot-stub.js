var botStub = {};

botStub.readMessage =  function(msg) {
  botStub.message = msg;
};

botStub.readQuery =  function(qry) {
  botStub.query = qry;
};

botStub.reset =  function() {
  botStub.query = '';
  botStub.message = '';
};

module.exports = botStub;

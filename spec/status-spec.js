var statusHandler = require('../routes/status');

describe('Route: /status', function(){
  it('sets status:UP in the response object', function(){
    statusHandler({}, {
      json: function(data) {
        expect(data).toEqual({ status: 'UP' });
      }
    });
  });
});

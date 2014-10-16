Rustaceans.Router.map(function() {
  this.resource('index', { path: '/' });
});
Rustaceans.Router.map(function() {
  this.resource('index', { path: '/index.html' });
});

Rustaceans.Router.map(function() {
  this.route('search', { path: 'search/:needle' });
});

Rustaceans.Router.map(function() {
  this.resource('people', { path: '/:username' });
});

Rustaceans.PeopleRoute = Ember.Route.extend({
  model: function(params) {
    return jQuery.getJSON('http://www.ncameron.org/rustaceans/user?username=' + params.username).then(function(res) {
      return { results: res };
    });
  },

  // TODO
  //serialize: function(model) {
  //  return { username: model.get('username') };
  //}
});


Rustaceans.SearchRoute = Ember.Route.extend({
  model: function(params) {
    return jQuery.getJSON('http://www.ncameron.org/rustaceans/search?for=' + params.needle).then(function(res) {
      return { results: res };
    });
  },
});


Rustaceans.ApplicationRoute = Ember.Route.extend({
  actions: {
    search: function(val) {
      this.transitionTo('search', val);
    }
  }
});

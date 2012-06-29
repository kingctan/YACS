// Generated by CoffeeScript 1.3.1
(function() {
  var API, Collection, Model, api;

  Model = (function() {

    Model.name = 'Model';

    function Model(attrs) {
      this.attrs = attrs;
      if (this.attrs == null) {
        this.attrs = {};
      }
      this.id = this.attrs.id;
    }

    Model.prototype.get = function(name, defvalue) {
      return this.attrs[name] || defvalue;
    };

    Model.prototype.set = function(name, value) {
      return this.attrs[name] = value;
    };

    Model.prototype.set_attributes = function(attrs) {
      return $.extend(this.attrs, attrs);
    };

    Model.prototype.to_hash = function() {
      return $.extend({}, this.attrs);
    };

    Model.prototype.replace_attributes = function(attrs) {
      this.attrs = $.extend({}, attrs);
      return this.id = this.attrs.id;
    };

    Model.prototype.refresh = function(options) {
      var self, success;
      options = options || {};
      success = options.success || $.noop;
      self = this;
      return $.ajax($.extend({
        url: this.get('url')
      }, options, {
        success: function(data) {
          self.replace_attributes(data.result);
          return success(self);
        }
      }));
    };

    return Model;

  })();

  Collection = (function() {

    Collection.name = 'Collection';

    function Collection(url) {
      this.url = url;
      this.id_map = {};
      this.data = [];
      this.length = 0;
    }

    Collection.prototype.attr = function(name) {
      var item;
      return [
        (function() {
          var _i, _len, _ref, _results;
          _ref = this.data;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            _results.push(item[name]);
          }
          return _results;
        }).call(this)
      ];
    };

    Collection.prototype.add = function(item) {
      this.data.push(item);
      this.id_map[item.id] = item;
      this.length = this.data.length;
      return this;
    };

    Collection.prototype.add_array = function(arr) {
      var item, _i, _len;
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        item = arr[_i];
        this.add(item);
      }
      return this;
    };

    Collection.prototype.clear = function() {
      this.slice(0);
      this.id_map = {};
      this.length = 0;
      return this;
    };

    Collection.prototype.get = function(id) {
      return this.id_map[id];
    };

    Collection.prototype.to_array = function() {
      return this.data.slice(0);
    };

    Collection.prototype.refresh = function(options) {
      var self, success, url;
      options = options || {};
      success = options.success;
      self = this;
      url = options.url || this.url;
      return $.ajax($.extend({
        url: url
      }, options, {
        success: function(data) {
          var item, _i, _len, _ref;
          self.data.splice(0, self.length);
          _ref = data.result;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            self.add(item);
          }
          return success(self);
        }
      }));
    };

    return Collection;

  })();

  API = (function() {

    API.name = 'API';

    function API(base_url) {
      this.base_url = base_url;
      this.filter = '';
      this.cache = {};
    }

    API.prototype.clear_cache = function() {
      return this.cache = {};
    };

    API.prototype.url = function(object, id) {
      if (id != null) {
        return this.base_url + object + '/' + id + '/';
      } else {
        return this.base_url + object + '/';
      }
    };

    API.prototype.get = function(url, success, error) {
      var success_callback, that;
      that = this;
      success_callback = function(data) {
        var collection, x;
        that.cache[url] = data;
        if (data.success) {
          if (_.isArray(data.result)) {
            collection = new Collection(url);
            [
              (function() {
                var _i, _len, _ref, _results;
                _ref = data.result;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  x = _ref[_i];
                  _results.push(collection.add(new Model(x, url + x.id + '/')));
                }
                return _results;
              })()
            ];
            return success(collection);
          } else {
            return success(new Model(data.result, url));
          }
        } else {
          return error(data, null);
        }
      };
      if (this.cache[url] != null) {
        success_callback(this.cache[url]);
        return null;
      }
      return $.ajax({
        url: url,
        type: 'GET',
        data: this.filter,
        dataType: 'json',
        cache: true,
        success: success_callback,
        error: function(xhr, txtStatus, exception) {
          return error(null, exception);
        }
      });
    };

    API.prototype.filter = function(query) {
      return this;
    };

    API.prototype.semesters = function(success, error, id) {
      return this.get(this.url('semesters', id), success, error);
    };

    API.prototype.departments = function(success, error, id) {
      return this.get(this.url('departments', id), success, error);
    };

    API.prototype.courses = function(success, error, id) {
      return this.get(this.url('courses', id), success, error);
    };

    API.prototype.sections = function(success, error, id) {
      return this.get(this.url('sections', id), success, error);
    };

    API.prototype.conflicts = function(success, error, id) {
      return this.get(this.url('conflicts', id), success, error);
    };

    API.prototype.schedules = function(options) {
      var data, url;
      options = $.extend({
        id: null,
        section_ids: null,
        success: $.noop,
        error: $.noop,
        cache: true
      }, options);
      assert((options.id != null) || (options.section_ids != null), 'id or section_ids need to be specified');
      if (options.section_ids) {
        data = '?section_id=' + options.section_ids.join('&section_id=');
      } else {
        data = '';
      }
      url = this.url('schedules', options.id) + data;
      if (this.cache[url] != null) {
        success_callback(this.cache[url]);
        return null;
      }
      return $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        cache: true,
        success: options.success,
        error: options.error
      });
    };

    return API;

  })();

  window.API = API;

  window.API.Model = Model;

  window.API.Collection = Collection;

  window.api = api = new API('/api/4/');

}).call(this);

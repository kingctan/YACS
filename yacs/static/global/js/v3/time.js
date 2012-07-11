// Generated by CoffeeScript 1.3.1
(function() {
  var Time;

  Time = (function() {

    Time.name = 'Time';

    function Time(properties, minute, second) {
      var fmt;
      if (typeof properties !== 'object') {
        properties = {
          hour: properties,
          minute: minute,
          second: second
        };
      }
      if (properties == null) {
        properties = {};
      }
      this.hour = parseInt(properties.hour, 10) || 0;
      this.minute = parseInt(properties.minute, 10) || 0;
      this.second = parseInt(properties.second, 10) || 0;
      fmt = '{{ unit }} must be between 0 and {{ max }} (inclusive)';
      assert(this.hour < 23 && this.hour >= 0, format(fmt, {
        unit: 'hour',
        max: 23
      }));
      assert(this.minute < 60 && this.minute >= 0, format(fmt, {
        unit: 'minute',
        max: 59
      }));
      assert(this.second < 60 && this.second >= 0, format(fmt, {
        unit: 'second',
        max: 59
      }));
    }

    Time.prototype.format = function(fmt, options) {
      var left_padding;
      options = $.extend({
        sep: ':'
      }, options);
      left_padding = function(n, padding, char) {
        var str;
        if (char == null) {
          char = ' ';
        }
        str = '' + n;
        while (str.length < padding) {
          str = char + str;
        }
        return str;
      };
      return format(fmt, {
        mhour: this.hour,
        zmhour: left_padding(this.hour, 2, '0'),
        hour: this.standardHour(),
        zhour: left_padding(this.standardHour(), 2, '0'),
        min: this.minute,
        zmin: left_padding(this.minute, 2, '0'),
        sec: this.second,
        zsec: left_padding(this.second, 2, '0'),
        sep_if_min: this.minute ? options.sep : '',
        sep_if_sec: this.second ? options.sep : '',
        min_if_min: this.minute ? this.minute : '',
        sec_if_sec: this.second ? this.second : '',
        zmin_if_min: this.minute ? left_padding(this.minute, 2, '0') : '',
        zsec_if_sec: this.second ? left_padding(this.second, 2, '0') : '',
        apm: this.isAM() ? 'am' : 'pm',
        upper_apm: this.isAM() ? 'AM' : 'PM',
        cap_apm: this.isAM() ? 'Am' : 'Pm'
      });
    };

    Time.prototype.int = function() {
      return this.hour * 3600 + this.minute * 60 + this.second;
    };

    Time.prototype.standardHour = function() {
      var h;
      h = this.hour % 12;
      if (h === 0) {
        return 12;
      } else {
        return h;
      }
    };

    Time.prototype.isPM = function() {
      return this.hour >= 12;
    };

    Time.prototype.isAM = function() {
      return !this.isPM();
    };

    return Time;

  })();

  Time.parse_military = function(string) {
    var parts;
    parts = string.split(':');
    return new Time(parts[0], parts[1], parts[2]);
  };

  this.Time = Time;

}).call(this);

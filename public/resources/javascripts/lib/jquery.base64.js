/*!
 * jquery.base64.js 0.1 - https://github.com/yckart/jquery.base64.js
 * Makes Base64 en & -decoding simpler as it is.
 *
 * Based upon: https://gist.github.com/Yaffle/1284012
 *
 * Copyright (c) 2012 Yannick Albert (http://yckart.com)
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).
 * 2013/02/10
 **/
(function(factory){
	 'function' === typeof define && (define.amd || define.cmd) ? define(function(require, exports, module){
	        var $ = require('jquery')||jQuery;
	        factory($);
	    }) : factory(jQuery);
}(function($){
	  var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
      a256 = '',
      r64 = [256],
      r256 = [256],
      i = 0;

  var UTF8 = {

      /**
       * Encode multi-byte Unicode string into utf-8 multiple single-byte characters
       * (BMP / basic multilingual plane only)
       *
       * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars
       *
       * @param {String} strUni Unicode string to be encoded as UTF-8
       * @returns {String} encoded string
       */
      encode: function(strUni) {
          // use regular expressions & String.replace callback function for better efficiency
          // than procedural approaches
          var strUtf = strUni.replace(/[\u0080-\u07ff]/g, // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
          function(c) {
              var cc = c.charCodeAt(0);
              return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
          })
          .replace(/[\u0800-\uffff]/g, // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
          function(c) {
              var cc = c.charCodeAt(0);
              return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3F, 0x80 | cc & 0x3f);
          });
          return strUtf;
      },

      /**
       * Decode utf-8 encoded string back into multi-byte Unicode characters
       *
       * @param {String} strUtf UTF-8 string to be decoded back to Unicode
       * @returns {String} decoded string
       */
      decode: function(strUtf) {
          // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
          var strUni = strUtf.replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, // 3-byte chars
          function(c) { // (note parentheses for precence)
              var cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | (c.charCodeAt(2) & 0x3f);
              return String.fromCharCode(cc);
          })
          .replace(/[\u00c0-\u00df][\u0080-\u00bf]/g, // 2-byte chars
          function(c) { // (note parentheses for precence)
              var cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f;
              return String.fromCharCode(cc);
          });
          return strUni;
      }
  };

  while(i < 256) {
      var c = String.fromCharCode(i);
      a256 += c;
      r256[i] = i;
      r64[i] = b64.indexOf(c);
      ++i;
  }

  function code(s, discard, alpha, beta, w1, w2) {
      s = String(s);
      var buffer = 0,
          i = 0,
          length = s.length,
          result = '',
          bitsInBuffer = 0;

      while(i < length) {
          var c = s.charCodeAt(i);
          c = c < 256 ? alpha[c] : -1;

          buffer = (buffer << w1) + c;
          bitsInBuffer += w1;

          while(bitsInBuffer >= w2) {
              bitsInBuffer -= w2;
              var tmp = buffer >> bitsInBuffer;
              result += beta.charAt(tmp);
              buffer ^= tmp << bitsInBuffer;
          }
          ++i;
      }
      if(!discard && bitsInBuffer > 0) result += beta.charAt(buffer << (w2 - bitsInBuffer));
      return result;
  }

  var Plugin = $.base64 = function(dir, input, encode) {
          return input ? Plugin[dir](input, encode) : dir ? null : this;
      };

  Plugin.btoa = Plugin.encode = function(plain, utf8encode) {
      plain = Plugin.raw === false || Plugin.utf8encode || utf8encode ? UTF8.encode(plain) : plain;
      plain = code(plain, false, r256, b64, 8, 6);
      return plain + '===='.slice((plain.length % 4) || 4);
  };

  Plugin.atob = Plugin.decode = function(coded, utf8decode) {
      coded = String(coded).split('=');
      var i = coded.length;
      do {--i;
          coded[i] = code(coded[i], true, r64, a256, 6, 8);
      } while (i > 0);
      coded = coded.join('');
      return Plugin.raw === false || Plugin.utf8decode || utf8decode ? UTF8.decode(coded) : coded;
  };


 /////////////////////////以下为$.cookie////////////////////////////////////////////////////

    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            // If we can't parse the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
            return config.json ? JSON.parse(s) : s;
        } catch(e) {}
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value;
    }

    var config = $.cookie = function (key, value, options) {

        // Write

        if (value !== undefined && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setTime(+t + days * 864e+5);
            }
            if(location.hostname.indexOf('192.168') > -1){
                options.domain=null;//开发专用设置
            }
            return (document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // Read

        var result = key ? undefined : {};

        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling $.cookie().
        var cookies = document.cookie ? document.cookie.split('; ') : [];

        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = parts.join('=');

            if (key && key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }

            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        if ($.cookie(key) === undefined) {
            return false;
        }

        // Must not alter options, thus extending a fresh object...
        $.cookie(key, '', $.extend({}, options, { expires: -1 }));
        return !$.cookie(key);
    };

    $.clearCookie = function (options){
        var keys=document.cookie.match(/[^ =;]+(?=\=)/g);
        if (keys) {
            for (var i = keys.length; i--;){
                $.removeCookie(keys[i],{
                    path: '/',
                    domain: 'o2o'+options.domain,
                });
                $.removeCookie(keys[i],options);
                document.cookie=keys[i]+'=0;expires=' + new Date(0).toUTCString();
            }
        }
    }






}));
 
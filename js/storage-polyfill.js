if(chrome.storage) {
  window.storage = chrome.storage;
} else if(localStorage) { // Firefox
  window.storage = {
    sync: {
      get: function(key, cb) {
        var data = {};
        data[key] = localStorage[key];
        return cb(data);
      },
      set: function(data, cb) {
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            localStorage[key] = data[key];
          }
        }
        
        return cb;
      }
    },
    onChanged: {
      addListener: function(cb) {
        window.addEventListener('storage', cb);
      }
    }
  };
}

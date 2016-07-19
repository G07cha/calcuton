function initialize() {
  var checkbox = document.getElementById('enabled-checkbox');
  var hostname = '';
  var sites = [];

  // Getting url of current tab
  chrome.tabs.getSelected(null, function(tab) {
    hostname = /:\/\/([^\/]+)/i.exec(tab.url)[1];

    // Check if current url exists in `disabled_sites` list
    storage.sync.get('disabled_sites', function(data) {
      sites = data.disabled_sites || sites;

      if(sites.indexOf(hostname) === -1) {
        checkbox.checked = true;
      }
    });
  });


  checkbox.addEventListener('click', function() {
    if(checkbox.checked === false) {
      sites.push(hostname);
    } else if(sites.indexOf(hostname) > -1) {
      sites.splice(sites.indexOf(hostname), 1);
    }

    storage.sync.set({
      disabled_sites: sites
    }, function() {
      console.log('Saved');
    });
  });
}

document.addEventListener('DOMContentLoaded', initialize);

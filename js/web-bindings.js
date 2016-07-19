storage.sync.get('disabled_sites', function(data) {
  if(data.disabled_sites === undefined ||
    data.disabled_sites.indexOf(window.location.hostname) === -1) {
    document.addEventListener('keyup', checkEvent);
  }
});

// Updating subscribtion status for `keyup` event
// if domain disabled or enabled for extension
storage.onChanged.addListener(function(changes) {
  if(changes.disabled_sites &&
    changes.disabled_sites.newValue.indexOf(window.location.hostname) > -1) {
    document.removeEventListener('keyup', checkEvent);
  } else {
    document.addEventListener('keyup', checkEvent);
  }
});

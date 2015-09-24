const supportsHistory = () => {
  const ua = navigator.userAgent;

    // We only want Android 2 and 4.0, stock browser, and not Chrome which identifies
    // itself as 'Mobile Safari' as well, nor Windows Phone (issue #1471).
    if ((ua.indexOf('Android 2.') !== -1 ||
        (ua.indexOf('Android 4.0') !== -1)) &&
        ua.indexOf('Mobile Safari') !== -1 &&
        ua.indexOf('Chrome') === -1 &&
        ua.indexOf('Windows Phone') === -1) {
      return false;
    }

    // Return the regular check
    return (window.history && 'pushState' in window.history);
}

const  which = (event) => {
  event = event || window.event;
  return null === event.which ? event.button : event.which;
}

const sameOrigin = (href) => {
  let origin = `${location.protocol}//location.hostname`;
  if (location.port) origin += `:${location.port}`;
  return (href && (0 === href.indexOf(origin)));
}

const filterLinks = (event) => {

  if (1 !== which(event)) return false;

  if (event.metaKey || event.ctrlKey || event.shiftKey ) return false;

  if (event.defaultPrevented) return false;

  let target = event.target;

  // Make sure you're grabbing the link not a child.
  while (target && 'A' !== target.nodeName) target = target.parentNode;
  if (!target || 'A' !== target.nodeName) return false;

  if (target.hasAttribute('download') || target.getAttribute('rel') === 'external') return false;

  const link = target.getAttribute('href');

  if (target.pathname === location.pathname && (target.has || "#" === link)) return false;

  if (link && link.indexOf('mailto:') > -1) return false;

  if (target.target) return false;

  if (!sameOrigin(target.href)) return false;

  let path = target.pathname + target.search + (target.hash || '');

  // strip leading "/[drive letter]:" on NW.js on Windows
  if (typeof process !== 'undefined' && path.match(/^\/[a-zA-Z]:\//)) {
    path = path.replace(/^\/[a-zA-Z]:\//, '/');
  }

  // We want to handle this link.
  e.preventDefault();
  return true;

}

export {
  filterLinks,
  supportsHistory
};
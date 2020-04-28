/*
 Look at all links in the current page and, if any of them references a YouTube video, install a
 click event handler that redirects to the corresponding video on ividio.us.

 Author: Francesco Pierfederici <me@pythoninside.com>

 Thanks to https://github.com/mperez01/no-youtube for inspiration
 */
// Change here if you host your own invidiuos instance or want another instance
const invidiousURL = 'https://www.invidio.us';

// Do not change anything below unless you know what you are doing ;-)
const ythostnames = [
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'www.m.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
];
const ytwatchhostnames = [
  'youtu.be',
];


function alreadySanitized(url) {
  return url.href.startsWith(invidiousURL);
}

function sanitizeYouTubeURL(url) {
  if (alreadySanitized(url)) {
    return url;
  }

  if (ythostnames.includes(url.hostname)) {
    if (url.pathname.search('^/(watch|playlist|search|channel)') > -1 || url.pathname.startsWith('/embed/')) {
      return new URL(`${invidiousURL}${url.pathname}${url.search}`);
    }
    return new URL(invidiousURL);
  }

  if (ytwatchhostnames.includes(url.hostname)) {
    return new URL(`${invidiousURL}/watch?v=${url.pathname.replace('/', '')}`);
  }
  return url;
}

function sanitizeGoogleURL(url) {
  if (url.searchParams.has('url')) {
    return new URL(url.searchParams.get('url'));
  }
  return new URL(url.searchParams.get('q'));
}

function sanitizeFacebookURL(url) {
  return new URL(url.searchParams.get('u'));
}

function isYouTubeLink(url) {
  return ythostnames.includes(url.hostname);
}

function isGoogleLink(url) {
  // Google is always trying to track you, huh?
  return url.hostname.includes('google') && url.pathname === '/url';
}

function isFacebookLink(url) {
  return url.hostname === 'l.facebook.com';
}

function escapeFromEvilEmpires() {
  let loc = new URL(window.top.location.href);

  if (isYouTubeLink(loc)) {
    loc = sanitizeYouTubeURL(loc);
  } else if (isGoogleLink(loc)) {
    loc = sanitizeGoogleURL(loc);
  } else if (isFacebookLink(loc)) {
    loc = sanitizeFacebookURL(loc);
  }
  if (loc.href !== window.top.location.href) {
    window.top.location.href = loc.href;
  }
}

escapeFromEvilEmpires();

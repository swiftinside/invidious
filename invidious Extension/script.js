/*
 Look at all links in the current page and, if any of them references a YouTube video, install a
 click event handler that redirects to the corresponding video on ividio.us.

 Author: Francesco Pierfederici <me@pythoninside.com>

 Thanks to https://github.com/mperez01/no-youtube for inspiration
 */
// Change here if you host your own invidiuos instance or want another instance
const kDefaultInvidiousURL = new URL('https://www.invidio.us');
const kKnowninvidiousHosts = [
  'invidio.us',
  'invidious.snopyta.org',
  'invidious.13ad.de',
  'invidious.ggc-project.de',
  'yt.maisputain.ovh',
  'invidious.toot.koeln',
  'yewtu.be',
  'invidious.fdn.fr',
];

// Do not change anything below unless you know what you are doing ;-)
/* global safari */
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

const kSelectedUrlKey = 'InstanceURL';
const kMessageTopic = 'instanceChanged';
const kPageLoadingTopic = 'pageLoading';

function alreadySanitized(url) {
  for (let i = 0; i < kKnowninvidiousHosts.length; i += 1) {
    if (url.hostname === kKnowninvidiousHosts[i]) {
      return true;
    }
  }
  return false;
}

function sanitizeYouTubeURL(url, invidiousURL) {
  if (alreadySanitized(url)) {
    return url;
  }

  if (ythostnames.includes(url.hostname)) {
    if (url.pathname.search('^/(watch|playlist|search|channel)') > -1 || url.pathname.startsWith('/embed/')) {
      return new URL(`${invidiousURL.href}${url.pathname}${url.search}`);
    }
    return invidiousURL;
  }

  if (ytwatchhostnames.includes(url.hostname)) {
    return new URL(`${invidiousURL.href}/watch?v=${url.pathname.replace('/', '')}`);
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

function escapeFromEvilEmpires(instanceURL) {
  let locURL = new URL(window.top.location.href);

  if (isGoogleLink(locURL)) {
    locURL = sanitizeGoogleURL(locURL);
  }

  if (isFacebookLink(locURL)) {
    locURL = sanitizeFacebookURL(locURL);
  }

  if (isYouTubeLink(locURL)) {
    locURL = sanitizeYouTubeURL(locURL, instanceURL);
  }

  if (locURL.href !== window.top.location.href) {
    window.top.location.href = locURL.href;
  }
}

// Here is what we do:
// 1. Send a message to our extension saying that the script is ready
//    Incidentally this means that the page is unlikely to be ready.
// 2. Listen for a reply. The reply better contain the URL of the instance to
//    use. Grab it and define the function to use to escape from evil ;-)
function selectInstanceToUse(event) {
  if (event.name === kMessageTopic) {
    let invidiousURL = new URL(event.message[kSelectedUrlKey]);
    if (typeof invidiousURL === 'undefined') {
      invidiousURL = kDefaultInvidiousURL;
    }
    escapeFromEvilEmpires(invidiousURL);
  }
}

// Listen for messages coming from our extension
safari.self.addEventListener('message', selectInstanceToUse);

// Notify extension that we are ready
safari.extension.dispatchMessage(kPageLoadingTopic);

/* eslint-disable no-console */

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
  for (let i = 0; i < kKnowninvidiousHosts.length; i += 1) {
    if (url.hostname === kKnowninvidiousHosts[i]) {
      return true;
    }
  }
  return false;
}

function sanitizeYouTubeURL(url, invidiousURL) {
  // We are given a YT URL, translate it to the invidious equivalent.

  if (alreadySanitized(url)) {
    return url;
  }

  const sanitizedURL = new URL(invidiousURL.href);

  // 1. Handle cases where a video ID is specified in the input URL
  let p = /(?:\/|%3D|v=|vi=)(?<vid>[0-9A-z-_]{11})(?:[%#?&]|$)/;
  let m = p.exec(url.href);
  if (m !== null && m.length > 1) {
    sanitizedURL.pathname = '/watch';
    sanitizedURL.search = `?v=${m.groups.vid}`;
    return sanitizedURL;
  }

  // 2. Handle all other cases.
  p = /(.*\.)youtu(be.com|\.be)\/(.*)/;
  m = p.exec(url.href);
  if (m !== null && m.length >= 3) {
    sanitizedURL.pathname = url.pathname;
    sanitizedURL.search = url.search;
    return sanitizedURL;
  }

  // 3. Dunno how to handle that, so I will just redirect to invidious
  return sanitizedURL;
}

function isYouTubeLink(url) {
  return ythostnames.includes(url.hostname) || ytwatchhostnames.includes(url.hostname);
}

function test(url, instanceURL) {
  if (isYouTubeLink(url)) {
    return sanitizeYouTubeURL(url, instanceURL);
  }
  return url;
}

const testURLs = [
  'https://m.youtube.com/watch?v=v0NSeysrDYw',
  'http://www.youtube.com/watch?v=v0NSeysrDYw',
  'http://www.youtube.com/v/v0NSeysrDYw?version=3&autohide=1',
  'http://youtu.be/v0NSeysrDYw',
  'http://www.youtube.com/oembed?url=http%3A//www.youtube.com/watch?v%3Dv0NSeysrDYw&format=json',
  'http://www.youtube.com/attribution_link?a=JdfC0C9V6ZI&u=%2Fwatch%3Fv%3Dv0NSeysrDYw%26feature%3Dshare',
  'https://www.youtube.com/attribution_link?a=8g8kPrPIi-ecwIsS&u=/watch%3Fv%3Dv0NSeysrDYw%26feature%3Dem-uploademail',
  'https://www.youtube.com/watch?v=v0NSeysrDYw&feature=em-uploademail',
  'https://www.youtube.com/watch?v=v0NSeysrDYw&feature=feedrec_grec_index',
  'https://www.youtube.com/user/IngridMichaelsonVEVO#p/a/u/1/v0NSeysrDYw',
  'https://www.youtube.com/v/v0NSeysrDYw?fs=1&amp;hl=en_US&amp;rel=0',
  'https://www.youtube.com/watch?v=v0NSeysrDYw#t=0m10s',
  'https://www.youtube.com/embed/v0NSeysrDYw?rel=0',
  'https://www.youtube-nocookie.com/embed/v0NSeysrDYw?rel=0',
  'https://www.youtube-nocookie.com/embed/v0NSeysrDYw?rel=0',
  'http://www.youtube.com/user/Scobleizer#p/u/1/v0NSeysrDYw',
  'http://www.youtube.com/watch?v=v0NSeysrDYw&feature=channel',
  'http://www.youtube.com/watch?v=v0NSeysrDYw&playnext_from=TL&videos=osPknwzXEas&feature=sub',
  'http://www.youtube.com/ytscreeningroom?v=v0NSeysrDYw',
  'http://www.youtube.com/watch?v=v0NSeysrDYw&feature=youtu.be',
  'http://www.youtube.com/user/Scobleizer#p/u/1/v0NSeysrDYw?rel=0',
  'http://www.youtube.com/embed/v0NSeysrDYw?rel=0',
  'https://www.youtube.com/watch?v=v0NSeysrDYw',
  'http://youtube.com/v/v0NSeysrDYw?feature=youtube_gdata_player',
  'http://youtube.com/?v=v0NSeysrDYw&feature=youtube_gdata_player',
  'http://www.youtube.com/watch?v=v0NSeysrDYw&feature=youtube_gdata_player',
  'http://youtube.com/?vi=v0NSeysrDYw&feature=youtube_gdata_player',
  'http://youtube.com/watch?v=v0NSeysrDYw&feature=youtube_gdata_player',
  'http://youtube.com/watch?vi=v0NSeysrDYw&feature=youtube_gdata_player',
  'http://youtube.com/vi/v0NSeysrDYw?feature=youtube_gdata_player',
  'http://youtu.be/v0NSeysrDYw?feature=youtube_gdata_player',
  'http://www.youtube.com/user/SilkRoadTheatre#p/a/u/2/v0NSeysrDYw',
  'https://www.youtube.com/watch?v=v0NSeysrDYw&list=PLGup6kBfcU7Le5laEaCLgTKtlDcxMqGxZ&index=106&shuffle=2655',
  'http://www.youtube.com/v/v0NSeysrDYw?fs=1&hl=en_US&rel=0',
  'http://www.youtube.com/watch?v=v0NSeysrDYw&feature=feedrec_grec_index',
  'http://www.youtube.com/watch?v=v0NSeysrDYw#t=0m10s',
  'http://www.youtube.com/embed/v0NSeysrDYw',
  'http://www.youtube.com/v/v0NSeysrDYw',
  'http://www.youtube.com/e/v0NSeysrDYw',
  'http://www.youtube.com/?v=v0NSeysrDYw',
  'http://www.youtube.com/watch?feature=player_embedded&v=v0NSeysrDYw',
  'http://www.youtube.com/?feature=player_embedded&v=v0NSeysrDYw',
  'http://www.youtube.com/user/IngridMichaelsonVEVO#p/u/11/v0NSeysrDYw',
  'http://www.youtube-nocookie.com/v/v0NSeysrDYw?version=3&hl=en_US&rel=0',
  'http://www.youtube.com/user/dreamtheater#p/u/1/v0NSeysrDYw',
  'https://youtu.be/v0NSeysrDYw?list=PLToa5JuFMsXTNkrLJbRlB--76IAOjRM9b',
  'http://www.youtube.com/watch?v=v0NSeysrDYw&feature=youtu.be',
  'http://youtu.be/v0NSeysrDYw&feature=channel',
  'http://www.youtube.com/ytscreeningroom?v=v0NSeysrDYw',
  'http://www.youtube.com/embed/v0NSeysrDYw?rel=0',
  'http://youtube.com/vi/v0NSeysrDYw&feature=channel',
  'http://youtube.com/?v=v0NSeysrDYw&feature=channel',
  'http://youtube.com/?feature=channel&v=v0NSeysrDYw',
  'http://youtube.com/?vi=v0NSeysrDYw&feature=channel',
  'http://youtube.com/watch?v=v0NSeysrDYw&feature=channel',
  'http://youtube.com/watch?vi=v0NSeysrDYw&feature=channel',
  'https://www.youtube.com/buzzsprout',
];

for (let i = 0; i < testURLs.length; i += 1) {
  console.log(`Test ${i}: ${testURLs[i]} -> ${test(new URL(testURLs[i]), kDefaultInvidiousURL).href}`);
}

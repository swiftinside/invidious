# flake8: noqa
"""
Test all possible YouTube URLs against a video ID extraction regex.
"""
import re


YTPAT = re.compile("(?:/|%3D|v=|vi=)([0-9A-z-_]{11})(?:[%#?&]|$)")


def extract_videoid(url, regex=YTPAT):
    m = regex.search(url)
    if not m:
        return None
    return m.groups()[0]


if __name__ == "__main__":
    import unittest


    class TestURLs(unittest.TestCase):
        URLs = (
            'https://m.youtube.com/watch?v={}',
            'http://www.youtube.com/watch?v={}',
            'http://www.youtube.com/v/{}?version=3&autohide=1',
            'http://youtu.be/{}',
            'http://www.youtube.com/oembed?url=http%3A//www.youtube.com/watch?v%3D{}&format=json',
            'http://www.youtube.com/attribution_link?a=JdfC0C9V6ZI&u=%2Fwatch%3Fv%3D{}%26feature%3Dshare',
            'https://www.youtube.com/attribution_link?a=8g8kPrPIi-ecwIsS&u=/watch%3Fv%3D{}%26feature%3Dem-uploademail',
            'https://www.youtube.com/watch?v={}&feature=em-uploademail',
            'https://www.youtube.com/watch?v={}&feature=feedrec_grec_index',
            'https://www.youtube.com/user/IngridMichaelsonVEVO#p/a/u/1/{}',
            'https://www.youtube.com/v/{}?fs=1&amp;hl=en_US&amp;rel=0',
            'https://www.youtube.com/watch?v={}#t=0m10s',
            'https://www.youtube.com/embed/{}?rel=0',
            'https://www.youtube-nocookie.com/embed/{}?rel=0',
            'https://www.youtube-nocookie.com/embed/{}?rel=0',
            'http://www.youtube.com/user/Scobleizer#p/u/1/{}',
            'http://www.youtube.com/watch?v={}&feature=channel',
            'http://www.youtube.com/watch?v={}&playnext_from=TL&videos=osPknwzXEas&feature=sub',
            'http://www.youtube.com/ytscreeningroom?v={}',
            'http://www.youtube.com/watch?v={}&feature=youtu.be',
            'http://www.youtube.com/user/Scobleizer#p/u/1/{}?rel=0',
            'http://www.youtube.com/embed/{}?rel=0',
            'https://www.youtube.com/watch?v={}',
            'http://youtube.com/v/{}?feature=youtube_gdata_player',
            'http://youtube.com/?v={}&feature=youtube_gdata_player',
            'http://www.youtube.com/watch?v={}&feature=youtube_gdata_player',
            'http://youtube.com/?vi={}&feature=youtube_gdata_player',
            'http://youtube.com/watch?v={}&feature=youtube_gdata_player',
            'http://youtube.com/watch?vi={}&feature=youtube_gdata_player',
            'http://youtube.com/vi/{}?feature=youtube_gdata_player',
            'http://youtu.be/{}?feature=youtube_gdata_player',
            'http://www.youtube.com/user/SilkRoadTheatre#p/a/u/2/{}',
            'https://www.youtube.com/watch?v={}&list=PLGup6kBfcU7Le5laEaCLgTKtlDcxMqGxZ&index=106&shuffle=2655',
            'http://www.youtube.com/v/{}?fs=1&hl=en_US&rel=0',
            'http://www.youtube.com/watch?v={}&feature=feedrec_grec_index',
            'http://www.youtube.com/watch?v={}#t=0m10s',
            'http://www.youtube.com/embed/{}',
            'http://www.youtube.com/v/{}',
            'http://www.youtube.com/e/{}',
            'http://www.youtube.com/?v={}',
            'http://www.youtube.com/watch?feature=player_embedded&v={}',
            'http://www.youtube.com/?feature=player_embedded&v={}',
            'http://www.youtube.com/user/IngridMichaelsonVEVO#p/u/11/{}',
            'http://www.youtube-nocookie.com/v/{}?version=3&hl=en_US&rel=0',
            'http://www.youtube.com/user/dreamtheater#p/u/1/{}',
            'https://youtu.be/{}?list=PLToa5JuFMsXTNkrLJbRlB--76IAOjRM9b',
            'http://www.youtube.com/watch?v={}&feature=youtu.be',
            'http://youtu.be/{}&feature=channel',
            'http://www.youtube.com/ytscreeningroom?v={}',
            'http://www.youtube.com/embed/{}?rel=0',
            'http://youtube.com/vi/{}&feature=channel',
            'http://youtube.com/?v={}&feature=channel',
            'http://youtube.com/?feature=channel&v={}',
            'http://youtube.com/?vi={}&feature=channel',
            'http://youtube.com/watch?v={}&feature=channel',
            'http://youtube.com/watch?vi={}&feature=channel',
        )
        IDs = (
            'm_kbvp0_8tc',
            '-wtIMTCHWuI',
            'EhxJLojIE_o',
            'yZv2daTWRZU',
            'QdK8U-VIH_o',
            '0zM3nApSvMg',
            'up_lNV-yoK4',
            '1p3vcRhsYGo',
            'cKZDdG9FTKY',
            'yZ-K7nCVnBI',
            'NRHVzbJVx8I',
            '6dwqZw0j_jY',
            'nas1rJpm7wY',
            'peFZbP64dsU',
            'dQw4w9WgXcQ',
            'ishbTyLs6ps',
            'KdwsulMb8EQ',
            '6L3ZvIMwZFM',
            'oTJRivZTMLs'
        )

        def test_extract_videoid(self):
            for url in self.URLs:
                for vid in self.IDs:
                    self.assertEqual(extract_videoid(url.format(vid)), vid, url)

    unittest.main()

"""Read publishers' public sharing-image URLs; never mirror bodies or image files."""
import datetime as dt
import html
import gzip
from html.parser import HTMLParser
import ipaddress
import json
from pathlib import Path
import socket
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / 'daily-media.json'
AGENT = 'JianjunPortfolio-LinkPreview/1.0 (+https://shaojian0514.github.io/)'

def public_url(value):
    try:
        url = urllib.parse.urlsplit(value)
        if url.scheme != 'https' or not url.hostname or url.username or url.password or url.port not in (None, 443):
            return False
        return all(ipaddress.ip_address(row[4][0]).is_global for row in socket.getaddrinfo(url.hostname, 443))
    except (ValueError, OSError):
        return False

class PublicRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        if not public_url(newurl):
            raise ValueError('Non-public redirect')
        return super().redirect_request(req, fp, code, msg, headers, newurl)

def read_url(url, maximum=1500000, accept='text/html'):
    if not public_url(url):
        raise ValueError('Not a public HTTPS URL')
    request = urllib.request.Request(url, headers={'User-Agent': AGENT, 'Accept': accept})
    with urllib.request.build_opener(PublicRedirect()).open(request, timeout=12) as response:
        raw = response.read(maximum)
        if raw.startswith(b'\x1f\x8b'):
            raw = gzip.decompress(raw)
        return raw, response.headers.get('Content-Type', ''), response.url

class SharingImageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.images = {}

    def handle_starttag(self, tag, attrs):
        if tag != 'meta':
            return
        data = dict(attrs)
        key = (data.get('property') or data.get('name') or '').lower()
        if key in ('og:image:secure_url', 'og:image', 'twitter:image', 'twitter:image:src') and data.get('content'):
            self.images.setdefault(key, data['content'])

def sharing_image(original):
    try:
        if urllib.parse.urlsplit(original).hostname in ('x.com', 'twitter.com', 'www.x.com'):
            return original, None
        raw, content_type, canonical = read_url(original)
        if 'html' not in content_type:
            return original, None
        parser = SharingImageParser()
        parser.feed(raw.decode('utf-8', errors='replace'))
        for key in ('og:image:secure_url', 'og:image', 'twitter:image', 'twitter:image:src'):
            value = parser.images.get(key)
            if not value:
                continue
            image = urllib.parse.urljoin(canonical, html.unescape(value))
            if any(token in urllib.parse.urlsplit(image).path.lower() for token in ('og-default', 'default-og', 'default_social', '/logo.')):
                continue
            if not public_url(image):
                continue
            _, mime, final_image = read_url(image, maximum=512, accept='image/*')
            if mime.startswith('image/') and 'svg' not in mime:
                return original, {'image': final_image, 'source': original}
    except Exception as exc:
        print('No preview:', urllib.parse.urlsplit(original).hostname, type(exc).__name__, str(exc)[:100])
    return original, None

def main():
    raw, _, _ = read_url('https://aihot.news/api/v1/dailies/latest', accept='application/json')
    report = json.loads(raw)['report']
    items = [item for section in report.get('sections', []) for item in section.get('items', [])][:8]
    urls = list(dict.fromkeys(item.get('links', {}).get('original') for item in items if item.get('links', {}).get('original')))
    old = json.loads(OUTPUT.read_text(encoding='utf-8')) if OUTPUT.exists() else {'images': {}}
    images = dict(old.get('images', {}))
    dates = dict(old.get('dates', {}))
    for original in urls:
        url, preview = sharing_image(original)
        if preview:
            images[url] = preview
    dates[report['date']] = urls
    dates = dict(sorted(dates.items(), reverse=True)[:60])
    retained = {url for links in dates.values() for url in links}
    images = {url: value for url, value in images.items() if url in retained}
    result = {'version': 1, 'updatedAt': dt.datetime.now(dt.timezone.utc).isoformat(), 'images': images, 'dates': dates}
    if images == old.get('images') and dates == old.get('dates'):
        print('Sharing-image index unchanged.')
        return
    OUTPUT.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Updated sharing-image index: {len(images)} covers; latest {report["date"]}.')

if __name__ == '__main__':
    main()

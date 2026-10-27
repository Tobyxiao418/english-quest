#!/usr/bin/env python3
"""Verify the deployed static runtime without printing user data."""
import json
import sys
import urllib.request
from urllib.parse import urljoin

base = sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:8765/'
assets = ['index.html', 'style.css', 'app.js', 'core.js', 'courses.js', 'audio-map.json']
results = []
for asset in assets:
    req = urllib.request.Request(urljoin(base, asset), headers={'Cache-Control': 'no-cache'})
    with urllib.request.urlopen(req, timeout=30) as response:
        body = response.read()
        if not body:
            raise RuntimeError(f'Empty runtime asset: {asset}')
        if asset == 'index.html' and b'English Quest' not in body:
            raise RuntimeError('Wrong homepage')
        if asset == 'audio-map.json':
            json.loads(body)
        results.append({'asset': asset, 'status': response.status, 'bytes': len(body)})
print(json.dumps({'base': base, 'verified': results}, ensure_ascii=False, indent=2))

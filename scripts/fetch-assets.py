"""Download the credited demo photographs once; the app serves local assets only."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.request import Request, urlopen
import json

ROOT = Path(__file__).resolve().parents[1]
ROWS = [
    ('p01', 'Domate të freskëta', 'Fruta & perime', 190, 48, '500 g', 'Farma e Gjelbër', '1546094096-0df4bcaaa337', True),
    ('p02', 'Avokado Hass', 'Fruta & perime', 160, 4, 'copë', 'Farma e Gjelbër', '1523049673857-eb18f1d7b578', True),
    ('p03', 'Qumësht i freskët', 'Bulmet & vezë', 145, 36, '1 L', 'Bjeshka Dairy', '1563636619-e9143da7973b', True),
    ('p04', 'Bukë artizanale', 'Furrë', 220, 24, '500 g', 'Furra e Lagjes', '1509440159596-0249088772ff', True),
    ('p05', 'Vezë nga ferma', 'Bulmet & vezë', 280, 18, '6 copë', 'Farma e Gjelbër', '1506976785307-8732e854ad03', False),
    ('p06', 'Djathë i stazhionuar', 'Bulmet & vezë', 350, 12, '250 g', 'Bjeshka Dairy', '1486297678162-eb2a19b0a32d', False),
    ('p07', 'Portokalle të ëmbla', 'Fruta & perime', 180, 42, 'kg', 'Farma e Gjelbër', '1547514701-42782101795e', False),
    ('p08', 'Mollë të kuqe', 'Fruta & perime', 150, 0, 'kg', 'Farma e Gjelbër', '1560806887-1e4cd0b6cbd6', False),
    ('p09', 'Banane', 'Fruta & perime', 175, 32, 'kg', 'Farma e Gjelbër', '1571771894821-ce9b6c11b08e', False),
    ('p10', 'Kruasan me gjalpë', 'Furrë', 120, 8, 'copë', 'Furra e Lagjes', '1555507036-ab1f4038808a', False),
    ('p11', 'Kafe në kokrra', 'Kafe & çaj', 690, 3, '250 g', 'Mulliri Coffee', '1447933601403-0c6688de566e', False),
    ('p12', 'Oriz kokërrgjatë', 'Artikuj bazë', 240, 40, '1 kg', 'Shtëpia e Shijes', '1586201375761-83865001e31c', False),
    ('p13', 'Makarona penne', 'Artikuj bazë', 160, 28, '500 g', 'Shtëpia e Shijes', '1551462147-ff29053bfc14', False),
    ('p14', 'Vaj ulliri ekstra', 'Artikuj bazë', 780, 15, '500 ml', 'Ullishtja', '1474979266404-7eaacbcd87c5', False),
    ('p15', 'Lëng portokalli', 'Pije', 230, 20, '1 L', 'Freskia', '1600271886742-f049cd451bba', False),
    ('p16', 'Ujë natyral', 'Pije', 60, 0, '1.5 L', 'Burimi', '1548839140-29a749e1cf4d', False),
    ('p17', 'Luleshtrydhe', 'Fruta & perime', 320, 5, '250 g', 'Farma e Gjelbër', '1464965911861-746a04b4bca6', False),
    ('p18', 'Kos me fruta', 'Bulmet & vezë', 135, 22, '200 g', 'Bjeshka Dairy', '1488477181946-6428a0291777', False),
]

def download(item):
    name, photo, width, height = item
    url = f'https://images.unsplash.com/photo-{photo}?auto=format&fit=crop&w={width}&h={height}&q=80'
    target = ROOT / 'public' / 'images' / f'{name}.jpg'
    if not target.exists():
        request = Request(url, headers={'User-Agent': 'MarketOneDemo/1.0'})
        with urlopen(request, timeout=40) as response:
            data = response.read()
            if 'image/' not in response.headers.get('Content-Type', ''):
                raise ValueError(f'Not an image: {url}')
            target.write_bytes(data)
    return f'{name}: {target.stat().st_size} bytes'

if __name__ == '__main__':
    (ROOT / 'public/images').mkdir(parents=True, exist_ok=True)
    (ROOT / 'public/data').mkdir(parents=True, exist_ok=True)
    products = [dict(zip(['id', 'name', 'category', 'priceCents', 'stock', 'unit', 'supplier'], row[:7]), image=f'/images/{row[0]}.jpg', featured=row[8]) for row in ROWS]
    (ROOT / 'public/data/products.json').write_text(json.dumps(products, ensure_ascii=False, indent=2) + '\n')
    assets = [(row[0], row[7], 480, 360) for row in ROWS] + [('hero', '1542838132-92c53300491e', 1000, 750)]
    with ThreadPoolExecutor(max_workers=4) as executor:
        for result in executor.map(download, assets):
            print(result)
    credits = '# Fotografitë\n\nFotografitë ilustruese janë nga Unsplash dhe ruhen lokalisht për demonstrim. Produktet dhe furnitorët janë të simuluar; fotografitë nuk përfaqësojnë marka ose pako reale të këtyre furnitorëve.\n\nLicenca: https://unsplash.com/license\n\n'
    credits += '\n'.join(f'- `{name}.jpg`: https://images.unsplash.com/photo-{photo}' for name, photo, _, _ in assets)
    (ROOT / 'ASSETS.md').write_text(credits + '\n')

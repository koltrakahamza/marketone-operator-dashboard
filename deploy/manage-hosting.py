"""Add/remove only MarketOne's marked route in the shared Caddy configuration.

No existing application code, containers, databases or Docker volumes are changed.
The source directory is intentionally kept after disabling the route.
"""
from datetime import datetime, timezone
from pathlib import Path
import argparse
import os
import subprocess

ROOT = Path(__file__).resolve().parents[1]
SHARED = ROOT.parent / 'Caddyfile'
PROXY = 'fror-production-caddy-1'
BEGIN = '# BEGIN MARKETONE DEMO'
END = '# END MARKETONE DEMO'
DOMAIN = 'marketone.178-104-201-39.sslip.io'
BLOCK = f'''{BEGIN}
{DOMAIN} {{
    reverse_proxy marketone-demo-web:8094
}}
{END}
'''


def validate(config):
    subprocess.run(['docker', 'exec', '-i', PROXY, 'caddy', 'validate', '--config', '/dev/stdin', '--adapter', 'caddyfile'], input=config, text=True, check=True)


def reload_proxy():
    subprocess.run(['docker', 'exec', PROXY, 'caddy', 'reload', '--config', '/etc/caddy/Caddyfile', '--adapter', 'caddyfile'], check=True)


def replace_if_unchanged(expected, replacement):
    # Preserve the inode: the shared Caddyfile is already bind-mounted.
    with SHARED.open('r+', encoding='utf-8') as handle:
        if handle.read() != expected:
            raise RuntimeError('Caddyfile changed concurrently. No changes were written; retry.')
        handle.seek(0)
        handle.write(replacement)
        handle.truncate()
        handle.flush()
        os.fsync(handle.fileno())


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('action', choices=['enable', 'disable'])
    args = parser.parse_args()
    original = SHARED.read_text()
    if original.count(BEGIN) != original.count(END) or original.count(BEGIN) > 1:
        raise RuntimeError('Unexpected MarketOne markers. Review the Caddyfile manually.')
    if args.action == 'enable':
        if BEGIN in original:
            print('MarketOne route is already enabled.')
            return
        if DOMAIN in original:
            raise RuntimeError('Domain already configured outside the MarketOne markers.')
        candidate = original + '\n' + BLOCK
    else:
        if BEGIN not in original:
            print('MarketOne route is already absent.')
            return
        start = original.index(BEGIN)
        stop = original.index(END, start) + len(END)
        if original[stop:stop + 1] == '\n':
            stop += 1
        if start > 0 and original[start - 1] == '\n':
            start -= 1
        candidate = original[:start] + original[stop:]
    validate(candidate)
    backup = ROOT / 'deploy/local'
    backup.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now(timezone.utc).strftime('%Y%m%d-%H%M%S')
    (backup / f'Caddyfile.before-{args.action}-{stamp}').write_text(original)
    replace_if_unchanged(original, candidate)
    try:
        reload_proxy()
    except subprocess.CalledProcessError:
        replace_if_unchanged(candidate, original)
        reload_proxy()
        raise
    print(f'MarketOne route {args.action}d. Existing routes preserved.')


if __name__ == '__main__':
    main()

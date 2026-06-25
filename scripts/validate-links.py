"""Pre-commit hook: registered external link labels must match .link-registry.json."""
import json, re, sys
from pathlib import Path

registry_path = Path(".link-registry.json")
if not registry_path.exists():
    sys.exit(0)

registry = json.loads(registry_path.read_text("utf-8"))
html = Path("index.html").read_text("utf-8")
pairs = re.findall(r'<a\s+href="(https://[^"]+)"[^>]*>([^<]+)</a>', html)

errors = []
for url, label in pairs:
    label = label.strip()
    if url in registry and registry[url] != label:
        errors.append(
            f"  {url}\n"
            f"    現在: {label}\n"
            f"    正本: {registry[url]}"
        )

if errors:
    print("BLOCKED: link label mismatch detected", file=sys.stderr)
    print("\n".join(errors), file=sys.stderr)
    print(f"\nFix the labels or update .link-registry.json", file=sys.stderr)
    sys.exit(1)

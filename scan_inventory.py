import re
import os

with open('src/App.tsx') as f:
    text = f.read()

# Find tabGroups
start_idx = text.find('const tabGroups = [')
pos = start_idx + len('const tabGroups = ')
bracket_count = 0
found_end = -1
for i in range(pos, len(text)):
    if text[i] == '[':
        bracket_count += 1
    elif text[i] == ']':
        bracket_count -= 1
        if bracket_count == 0:
            found_end = i + 1
            break

tab_groups_str = text[start_idx:found_end]

# Parse each group
# We can find each { name: '...', ... tabs: [ ... ] }
group_blocks = re.findall(r'\{\s*name:\s*[\'"]([^\'"]+)[\'"]\s*,.*?tabs:\s*\[(.*?)\]\s*(?:,|\n\s*\})', tab_groups_str, re.DOTALL)

print(f"Total groups found: {len(group_blocks)}")

all_tabs = []
group_tabs_map = {}

for g_name, tabs_content in group_blocks:
    items = re.findall(r'\{\s*id:\s*[\'"]([^\'"]+)[\'"]\s*,\s*label:\s*[\'"]([^\'"]+)[\'"]', tabs_content)
    group_tabs_map[g_name] = items
    all_tabs.extend([(g_name, item[0], item[1]) for item in items])

print(f"Total tab entries (including dividers): {len(all_tabs)}")
non_dividers = [t for t in all_tabs if not t[1].startswith('divider_')]
print(f"Total non-divider tabs: {len(non_dividers)}")

for g_name, items in group_tabs_map.items():
    nd = [t for t in items if not t[0].startswith('divider_')]
    print(f"  {g_name}: {len(items)} total ({len(nd)} non-dividers)")


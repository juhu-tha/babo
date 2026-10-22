import re
import os

with open('src/metaDescriptions.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# TAB_DESCRIPTIONS = { 'tab_id': { ... } }
pattern = re.compile(r'^\s*[\'"]([a-zA-Z0-9_\-]+)[\'"]\s*:\s*\{', re.MULTILINE)
desc_keys = pattern.findall(text)
print(f"TAB_DESCRIPTIONS entries: {len(desc_keys)}")

with open('src/contexts/TabContext.tsx', 'r', encoding='utf-8') as f:
    text_tc = f.read()
tc_ids = re.findall(r'\|\s*[\'"]([a-zA-Z0-9_\-]+)[\'"]', text_tc)
print(f"TabContext TabId union types: {len(tc_ids)}")

with open('src/data/moduleOverviewsData.ts', 'r', encoding='utf-8') as f:
    text_mo = f.read()
mo_keys = re.findall(r'^\s*[\'"]([a-zA-Z0-9_\-]+)[\'"]\s*:\s*\{', text_mo, re.MULTILINE)
print(f"moduleOverviewsData entries: {len(mo_keys)}")

# Let's check files_with_tabs.txt
if os.path.exists('files_with_tabs.txt'):
    with open('files_with_tabs.txt') as f:
        print(f"files_with_tabs.txt lines: {len(f.readlines())}")


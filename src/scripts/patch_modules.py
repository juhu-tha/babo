import os, re

def update_file(filepath, replacements):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return 0
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    orig = content
    cnt = 0
    for old, new in replacements:
        if isinstance(old, str):
            if old in content:
                occurrences = content.count(old)
                content = content.replace(old, new)
                cnt += occurrences
        else:
            matches = len(old.findall(content))
            if matches > 0:
                content = old.sub(new, content)
                cnt += matches
    if content != orig:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated {filepath}: {cnt} replacements")
        return cnt
    else:
        print(f"No changes in {filepath}")
        return 0

if __name__ == "__main__":
    print("Helper ready")

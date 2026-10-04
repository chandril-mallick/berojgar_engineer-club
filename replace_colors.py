import os
import re

# Dictionary mapping hex to CSS variables
color_map = {
    # Danger
    r'#800000': 'var(--color-danger)',
    r'#990000': 'var(--color-danger)',
    r'#b91c1c': 'var(--color-danger)',
    r'#dc2626': 'var(--color-danger)',
    r'#ef4444': 'var(--color-danger)',
    r'#EA4335': 'var(--color-danger)',
    
    # Link
    r'#0284c7': 'var(--color-link)',
    r'#1d4ed8': 'var(--color-link)',
    r'#3b82f6': 'var(--color-link)',
    r'#0369a1': 'var(--color-link)',
    r'#06b6d4': 'var(--color-link)',
    r'#2563eb': 'var(--color-link)',
    r'#007CC3': 'var(--color-link)',
    r'#0530AD': 'var(--color-link)',
    r'#4285F4': 'var(--color-link)',
    r'#00A4EF': 'var(--color-link)',
    
    # Brand
    r'#ec4899': 'var(--color-brand)',
    r'#f59e0b': 'var(--color-brand)',
    r'#7c3aed': 'var(--color-brand)',
    r'#a855f7': 'var(--color-brand)',
    r'#f97316': 'var(--color-brand)',
    r'#FF9900': 'var(--color-brand)',
    r'#8b5cf6': 'var(--color-brand)',
    r'#6366f1': 'var(--color-brand)',
    r'#FBBC05': 'var(--color-brand)',
    r'#9333ea': 'var(--color-brand)',
    r'#d97706': 'var(--color-brand)',
    
    # Success
    r'#10b981': 'var(--color-success)',
    r'#00A896': 'var(--color-success)',
    r'#14b8a6': 'var(--color-success)',
    r'#34A853': 'var(--color-success)',
    
    # Muted
    r'#6b7280': 'var(--color-muted)',
    r'#71717a': 'var(--color-muted)',
    
    # Foreground / Background
    r'#000000': 'var(--color-foreground)',
    r'#0a0a0a': 'var(--color-foreground)',
    r'#18181b': 'var(--color-foreground)',
    r'#0f172a': 'var(--color-foreground)',
    r'#0f0f0f': 'var(--color-foreground)',
    r'#ffffff': 'var(--color-background)',
    r'#fffdf5': 'var(--color-background)',
    r'#e4e4e7': 'var(--color-border)',
    r'#e9e9f0': 'var(--color-border)',
}

exclude_files = [
    'bec-badge-icon.tsx', 
    'auth-modal.tsx', 
    'globals.css'
]

def process_file(file_path):
    # Skip excluded files
    if any(ex in file_path for ex in exclude_files):
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    for hex_color, css_var in color_map.items():
        # Case insensitive replacement for hex colors
        pattern = re.compile(re.escape(hex_color), re.IGNORECASE)
        content = pattern.sub(css_var, content)

    # Some remaining short hexes? Let's check #fff
    if '#fff"' in content or "#fff'" in content or '#fff;' in content:
        content = re.sub(r'(?i)#fff([\'";])', r'var(--color-background)\1', content)
        
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file_path}")

def main():
    for root, dirs, files in os.walk('src'):
        for file in files:
            if file.endswith('.ts') or file.endswith('.tsx'):
                process_file(os.path.join(root, file))

if __name__ == '__main__':
    main()

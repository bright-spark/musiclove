import os
import glob
import re
from collections import defaultdict

def analyze_html_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    analysis = {
        'file': os.path.basename(filepath),
        'has_framework7_css': '../node_modules/framework7/framework7-bundle.min.css' in content,
        'has_app_css': '../css/app.css' in content,
        'has_thorium_css': '../css/thorium.min.css' in content or 'thorium.min.css' in content,
        'has_dark_theme': 'theme-dark' in content,
        'has_red_theme': 'color-theme-red' in content,
        'has_inline_styles': bool(re.search(r'<style[^>]*>', content)),
        'has_iframe': '<iframe' in content,
        'type': 'unknown'
    }
    
    # Determine page type
    if '<iframe' in content:
        analysis['type'] = 'iframe'
    elif '<div class="page"' in content:
        analysis['type'] = 'framework7'
    elif 'thorium' in content.lower():
        analysis['type'] = 'thorium'
    else:
        analysis['type'] = 'other'
        
    return analysis

def main():
    html_files = glob.glob('*.html')
    results = []
    
    for html_file in html_files:
        if html_file not in ['template-iframe.html', 'template-content.html']:
            results.append(analyze_html_file(html_file))
    
    # Print summary
    print("\nHTML Files Analysis Summary:")
    print("-" * 50)
    
    types = defaultdict(int)
    needs_update = []
    
    for r in results:
        types[r['type']] += 1
        if not (r['has_framework7_css'] and r['has_app_css'] and r['has_thorium_css'] and 
                r['has_dark_theme'] and r['has_red_theme']):
            needs_update.append(r['file'])
    
    print("\nPage Types:")
    for t, count in types.items():
        print(f"- {t}: {count} files")
    
    print("\nFiles needing update:")
    for f in needs_update:
        print(f"- {f}")
    
    print("\nDetailed Analysis:")
    for r in results:
        print(f"\n{r['file']}:")
        print(f"  Type: {r['type']}")
        print(f"  Framework7 CSS: {'✓' if r['has_framework7_css'] else '✗'}")
        print(f"  App CSS: {'✓' if r['has_app_css'] else '✗'}")
        print(f"  Thorium CSS: {'✓' if r['has_thorium_css'] else '✗'}")
        print(f"  Dark Theme: {'✓' if r['has_dark_theme'] else '✗'}")
        print(f"  Red Theme: {'✓' if r['has_red_theme'] else '✗'}")
        print(f"  Has iFrame: {'✓' if r['has_iframe'] else '✗'}")
        print(f"  Has Inline Styles: {'✓' if r['has_inline_styles'] else '✗'}")

if __name__ == '__main__':
    main()

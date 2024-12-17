import os
import glob
import re
from bs4 import BeautifulSoup

IFRAME_TEMPLATE = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>{title}</title>
    
    <link rel="stylesheet" href="../node_modules/framework7/framework7-bundle.min.css">
    <link rel="stylesheet" href="../css/app.css">
    <link rel="stylesheet" href="../css/thorium.min.css">
    
    <!-- Preserve any additional head content -->
    {additional_head}
</head>
<body class="theme-dark color-theme-red">
    <div class="iframe-container">
        {iframe_content}
    </div>
    
    <!-- Preserve any scripts -->
    {scripts}
</body>
</html>'''

CONTENT_TEMPLATE = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>{title}</title>
    
    <link rel="stylesheet" href="../node_modules/framework7/framework7-bundle.min.css">
    <link rel="stylesheet" href="../css/app.css">
    <link rel="stylesheet" href="../css/thorium.min.css">
    
    <!-- Preserve any additional head content -->
    {additional_head}
</head>
<body class="theme-dark color-theme-red">
    <div class="page">
        <div class="page-content">
            {body_content}
        </div>
    </div>
    
    <!-- Preserve any scripts -->
    {scripts}
</body>
</html>'''

def extract_content(soup):
    # Extract title
    title = soup.title.string if soup.title else "Music Love"
    
    # Extract additional head content (excluding title and standard meta)
    head = soup.head
    additional_head = []
    if head:
        for tag in head.find_all():
            if tag.name not in ['title', 'meta'] and 'stylesheet' not in str(tag):
                additional_head.append(str(tag))
    
    # Extract scripts
    scripts = []
    for script in soup.find_all('script'):
        scripts.append(str(script))
    
    # Extract iframe content if present
    iframe_content = []
    for iframe in soup.find_all('iframe'):
        iframe_content.append(str(iframe))
    
    # Extract body content (excluding scripts)
    body = soup.body
    body_content = []
    if body:
        for tag in body.find_all(recursive=False):
            if tag.name != 'script' and not tag.find('iframe'):
                body_content.append(str(tag))
    
    return {
        'title': title,
        'additional_head': '\n    '.join(additional_head),
        'scripts': '\n    '.join(scripts),
        'iframe_content': '\n        '.join(iframe_content),
        'body_content': '\n            '.join(body_content)
    }

def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Parse HTML
    soup = BeautifulSoup(content, 'html.parser')
    extracted = extract_content(soup)
    
    # Determine if it's an iframe page
    has_iframe = bool(soup.find('iframe'))
    
    # Choose template
    template = IFRAME_TEMPLATE if has_iframe else CONTENT_TEMPLATE
    
    # Generate new content
    new_content = template.format(**extracted)
    
    # Create backup
    backup_path = filepath + '.bak'
    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    # Write new content
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Updated {os.path.basename(filepath)}")

def main():
    # Update all HTML files except templates
    html_files = glob.glob('*.html')
    exclude = ['template-iframe.html', 'template-content.html']
    
    for html_file in html_files:
        if html_file not in exclude:
            try:
                update_file(html_file)
            except Exception as e:
                print(f"Error updating {html_file}: {str(e)}")

if __name__ == '__main__':
    main()

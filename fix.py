import os
import glob

components_dir = 'client/src/components/ui/*.tsx'
files = glob.glob(components_dir)

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace("import React from 'react';", "import * as React from 'react';")
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
print('Fixed imports')

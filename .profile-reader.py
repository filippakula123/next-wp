import json, re
from pathlib import Path
source=Path(r'C:\Users\Mariusz\Desktop\luzik-traktor\luzikkielce-pl-20261006-095212-gko66qx03zfm\database.sql')
profiles=[]
columns=[]
inside=False
def rows(text):
    pos=text.index('VALUES')+6
    while pos<len(text):
        if text[pos]!='(':
            pos+=1;continue
        pos+=1;row=[]
        while pos<len(text):
            while text[pos].isspace():pos+=1
            if text[pos]=="'":
                pos+=1;value=[]
                while pos<len(text):
                    char=text[pos];pos+=1
                    if char=='\\':
                        char=text[pos];pos+=1
                        value.append({'n':'\n','r':'\r','t':'\t','0':'\0'}.get(char,char))
                    elif char=="'":
                        if pos<len(text) and text[pos]=="'":value.append("'");pos+=1
                        else:break
                    else:value.append(char)
                row.append(''.join(value))
            else:
                end=pos
                while text[end] not in ',)':end+=1
                row.append(text[pos:end].strip());pos=end
            while text[pos].isspace():pos+=1
            if text[pos]==')':pos+=1;break
            pos+=1
        yield row
with source.open(encoding='utf-8',errors='replace') as handle:
    for line in handle:
        if re.match(r'CREATE TABLE .*`[^`]*_posts`',line):inside=True;columns=[]
        elif inside and line.startswith('  `'):columns.append(line.split('`')[1])
        elif inside and line.startswith(')'):inside=False
        elif re.match(r'INSERT INTO `[^`]*_posts`',line):
            for values in rows(line):
                post=dict(zip(columns,values))
                if post.get('post_type') in ['team','udrive_team','bdevs-team']:
                    profiles.append({key:post.get(key) for key in ['ID','post_type','post_name','post_title','post_content','post_status']})
Path('.profile-source.json').write_text(json.dumps(profiles,ensure_ascii=False,indent=2),encoding='utf-8')
print([(p['ID'],p['post_name'],len(p['post_content'] or '')) for p in profiles])

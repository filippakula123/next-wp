import json, re, html, difflib
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit

ROOT = Path(__file__).parent
class Node:
    def __init__(self, tag='', attrs=()):
        self.tag, self.attrs, self.children = tag, dict(attrs), []
    def text(self):
        return ''.join(c if isinstance(c, str) else c.text() for c in self.children)
    def walk(self):
        yield self
        for c in self.children:
            if isinstance(c, Node): yield from c.walk()

class Parser(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.root = Node(); self.stack = [self.root]; self.feed(source)
    def handle_starttag(self, tag, attrs):
        n = Node(tag, attrs); self.stack[-1].children.append(n)
        if tag not in ('img','br','hr','input','meta','link','source','wbr'): self.stack.append(n)
    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if self.stack[-1].tag == tag: self.stack.pop()
    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]; break
    def handle_data(self, text): self.stack[-1].children.append(text)

original = json.loads((ROOT/'original-posts.json').read_text('utf-8-sig'))
current = json.loads((ROOT/'current-posts.json').read_text('utf-8-sig'))
aliases = {'egzamin-teoretyczny-na-prawo-jazdy-ile-trwa-egzamin-i-jak-wyglada': 'jak-wyglada-egzamin-teoretyczny-na-prawo-jazdy-2026'}
slugs = {p['slug'] for p in current}
missing = [p for p in original if p['slug'] not in slugs and p['slug'] not in aliases]

def norm(s): return ' '.join(s.replace('\xa0',' ').split())
def link(url):
    u = urlsplit(url)
    if u.hostname in ('luzikkielce.pl','www.luzikkielce.pl'):
        path = u.path.strip('/')
        path = aliases.get(path, path)
        path = path.replace('kursy-prawa-jazdy/kursy-prawa-jazdy-', 'kursy-prawa-jazdy-')
        return '/' + path + ('?'+u.query if u.query else '') + ('#'+u.fragment if u.fragment else '')
    return url

allowed = {'p','h2','h3','h4','h5','h6','ul','ol','li','strong','b','em','i','a','br','table','thead','tbody','tr','th','td','blockquote','sup','sub'}
def clean(n):
    if isinstance(n,str): return html.escape(n.replace('\xa0',' '))
    if n.tag in ('script','style','svg','img'): return ''
    inner = ''.join(clean(c) for c in n.children)
    if n.tag not in allowed: return inner
    if not norm(n.text()) and n.tag != 'br': return ''
    tag = {'b':'strong','i':'em'}.get(n.tag,n.tag)
    attrs = ''
    if tag == 'a': attrs = ' href="'+html.escape(link(n.attrs.get('href','')),quote=True)+'"'
    if tag in ('td','th'):
        for key in ('colspan','rowspan'):
            if key in n.attrs: attrs += f' {key}="{html.escape(n.attrs[key],quote=True)}"'
    if tag == 'br': return '<br>'
    return f'<{tag}{attrs}>{inner}</{tag}>'

def extract(post):
    tree = Parser(post['content']['rendered']).root
    result = []
    for n in tree.walk():
        kind = n.attrs.get('data-widget_type')
        if kind == 'heading.default':
            for h in n.walk():
                if h.tag in ('h2','h3','h4','h5','h6'): result.append(clean(h))
        elif kind == 'text-editor.default':
            result.append(clean(n))
        elif kind == 'html.default' and any(c.tag == 'table' for c in n.walk()):
            # Some articles store informative tables in HTML widgets alongside their CSS.
            # Keep their content; clean() removes styles and layout wrappers.
            result.append(clean(n))
    return '\n\n'.join(x.strip() for x in result if x.strip())

def gutenberg(source):
    root = Parser(source).root
    blocks=[]
    for n in root.children:
        if isinstance(n,str):
            if norm(n): raise ValueError('Text outside block: '+n)
            continue
        rendered=clean(n)
        if n.tag.startswith('h'):
            level=int(n.tag[1]); name='heading'
            attr='' if level==2 else ' '+json.dumps({'level':level}, separators=(',',':'))
            rendered=rendered.replace('<'+n.tag+'>','<'+n.tag+' class="wp-block-heading">',1)
        elif n.tag in ('ol','ul'):
            name='list'; attr=' {"ordered":true}' if n.tag=='ol' else ''
            rendered=rendered.replace('<'+n.tag+'>','<'+n.tag+' class="wp-block-list">',1)
            rendered=rendered.replace('<li>','<!-- wp:list-item -->\n<li>').replace('</li>','</li>\n<!-- /wp:list-item -->')
        elif n.tag=='table':
            name='table'; attr=''; rendered='<figure class="wp-block-table">'+rendered+'</figure>'
        elif n.tag=='p': name='paragraph'; attr=''
        elif n.tag=='blockquote': name='quote'; attr=''; rendered=rendered.replace('<blockquote>','<blockquote class="wp-block-quote">',1)
        else: raise ValueError('Unexpected block '+n.tag)
        blocks.append(f'<!-- wp:{name}{attr} -->\n{rendered}\n<!-- /wp:{name} -->')
    return '\n\n'.join(blocks)

out=ROOT/'gotowe-wpisy'; out.mkdir(exist_ok=True)
media={m['id']:m for m in json.loads((ROOT/'media.json').read_text('utf-8-sig'))}
categories={c['id']:html.unescape(c['name']) for c in json.loads((ROOT/'categories.json').read_text('utf-8-sig'))}
seo=json.loads((ROOT/'rank-math-seo.json').read_text('utf-8'))
seo_text=['RANK MATH SEO — 12 WPISÓW LUZIKA', '', 'W panelu Rank Math wklej Tytuł SEO i Opis w edycji podglądu wyniku wyszukiwania, a frazę w polu frazy kluczowej. Wpisuj podane tytuły jako gotowy tekst, bez dodatkowych zmiennych z nazwą strony.', 'Uproszczone nazwy zachowaj zgodnie z materiałami do migracji.', 'To propozycje redakcyjne dopasowane do treści, bez badania liczby wyszukiwań.', '']
cards=[]; inventory=[]
for i,p in enumerate(missing,1):
    slug=p['slug']; title=html.unescape(p['title']['rendered']); body=extract(p)
    blocks=gutenberg(body)
    (out/(slug+'.gutenberg.html')).write_text(blocks,encoding='utf-8')
    plain=re.sub(r'</(?:p|h[2-6]|li|tr|ul|ol)>', '\n\n', body)
    plain=Parser(plain).root.text()
    (out/(slug+'.txt')).write_text(plain.strip()+'\n',encoding='utf-8')
    imgs=[n.attrs for n in Parser(p['content']['rendered']).root.walk() if n.tag=='img']
    item={'title':title,'slug':slug,'original_date':p['date'],'source':p['link'],'featured_media':p['featured_media'],'categories':p['categories'],'images':imgs,'characters':len(Parser(body).root.text())}
    inventory.append(item)
    catnames=', '.join(categories[x] for x in p['categories'])
    image=media.get(p['featured_media'],{}).get('source_url','')
    meta=seo[slug]
    seo_text.extend([f'{i}. {title}',f'Uproszczona nazwa: {slug}',f'Fraza kluczowa: {meta["focus_keyword"]}',f'Tytuł SEO: {meta["seo_title"]}',f'Opis meta: {meta["description"]}',''])
    seo_fields=''.join(f'<p><b>{label}:</b> <span>{html.escape(meta[key])}</span> <button type="button" onclick="copySeo(this)">Kopiuj</button></p>' for label,key in [('Fraza kluczowa','focus_keyword'),('Tytuł SEO','seo_title'),('Opis meta','description')])
    cards.append(f'''<section id="{slug}"><div class="controls"><span>{i:02d} / {len(missing)}</span><h1>{html.escape(title)}</h1><p><b>Tytuł:</b> <span>{html.escape(title)}</span> <button onclick="copyTitle(this)">Kopiuj tytuł</button></p><p><b>Uproszczona nazwa:</b> <code>{slug}</code></p><p>Data oryginału: {p['date'][:10]} · Kategoria: {html.escape(catnames)} · <a href="{p['link']}">Oryginalny wpis</a> · <a href="{html.escape(image,quote=True)}">Oryginalny obrazek wyróżniający</a></p><button onclick="copyBody(this)">Kopiuj treść do Gutenberga</button><a download href="gotowe-wpisy/{slug}.gutenberg.html">Pobierz kod bloków</a><p class="status" aria-live="polite"></p></div><article>{body}</article></section>''')
    cards[-1]=cards[-1].replace('<button onclick="copyBody(this)">', '<div class="seo"><h2>Rank Math SEO</h2>'+seo_fields+'<p>Wklej gotowy tytuł bez dodatkowych zmiennych z nazwą strony. Uproszczoną nazwę zachowaj jak wyżej.</p></div><button onclick="copyBody(this)">')
    # Clipboard HTML resolves relative links against this local file's file:// URL.
    # Use public URLs in the copyable browser view; Gutenberg source files remain portable.
    public_body=body.replace('href="/', 'href="https://mediumslateblue-porpoise-987005.hostingersite.com/')
    cards[-1]=cards[-1].replace('<article>'+body+'</article>', '<article>'+public_body+'</article>')

nav=''.join(f'<li><a href="#{p["slug"]}">{html.escape(html.unescape(p["title"]["rendered"]))}</a></li>' for p in missing)
document='''<!doctype html><html lang="pl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Brakujące wpisy Luzika — gotowe do Gutenberga</title><style>body{font:17px/1.7 system-ui,sans-serif;color:#17233b;background:#f2f5fa;margin:0}main{max-width:960px;margin:auto;padding:32px 20px}section,header{background:white;padding:32px;margin:24px 0;border-radius:12px}h1,h2,h3{line-height:1.3}h1{font-size:28px}h2{font-size:25px;margin-top:32px}h3{font-size:21px}button{background:#173b9c;color:white;border:0;padding:12px 18px;border-radius:7px;cursor:pointer;font-size:15px;margin:6px}a{color:#1648a4}code{overflow-wrap:anywhere}table{border-collapse:collapse;width:100%}th,td{border:1px solid #bbb;padding:8px;text-align:left}.controls{border-bottom:2px solid #e6eaf2;padding-bottom:18px;margin-bottom:24px}.status{color:#27603b}article{overflow-wrap:break-word}@media print{button,.controls a,header{display:none}section{break-before:page;padding:0}body{background:white}}</style><main><header><h1>12 brakujących wpisów Luzika</h1><p>Porównanie opublikowanych wpisów: 28 października 2026. Oryginał: 50 wpisów. Obecny WordPress: 38 wpisów. Jeden starszy artykuł występuje pod zmienionym adresem — nie dodawaj go ponownie.</p><p>W WordPressie wybierz Wpisy → Dodaj wpis. Wklej tytuł w pole tytułu. Kliknij „Kopiuj treść do Gutenberga”, ustaw kursor w pustej treści wpisu i wklej. Ustaw podaną uproszczoną nazwę, kategorię oraz obrazek wyróżniający. Daty poniżej są datami oryginałów.</p><p>Jeśli przeglądarka blokuje schowek: zaznacz i skopiuj sam tekst artykułu poniżej separatora. Alternatywnie otwórz plik .gutenberg.html jako tekst, skopiuj całość do edytora kodu Gutenberga, po czym wróć do edytora wizualnego.</p><p>To pełne teksty przeniesione z oryginalnych wpisów, bez układu Elementora, banerów reklamowych, automatycznego spisu treści i obrazów w treści. Zachowano nagłówki, listy, tabele, FAQ oraz źródła. Odnośniki do Luzika prowadzą do odpowiadających im ścieżek na obecnej stronie. Treści nie były aktualizowane ani poddawane odrębnej weryfikacji merytorycznej.</p><ol>'''+nav+'''</ol></header>'''+''.join(cards)+'''</main><script>async function copyTitle(b){const s=b.closest('section');try{await navigator.clipboard.writeText(s.querySelector('h1').textContent);s.querySelector('.status').textContent='Tytuł skopiowany.'}catch(e){s.querySelector('.status').textContent='Zaznacz tytuł i skopiuj go ręcznie.'}}async function copyBody(b){const s=b.closest('section'),a=s.querySelector('article');try{await navigator.clipboard.write([new ClipboardItem({'text/html':new Blob([a.innerHTML],{type:'text/html'}),'text/plain':new Blob([a.innerText],{type:'text/plain'})})]);s.querySelector('.status').textContent='Treść skopiowana. Wklej ją w pustej treści wpisu w Gutenbergu.'}catch(e){const r=document.createRange();r.selectNodeContents(a);const sel=window.getSelection();sel.removeAllRanges();sel.addRange(r);s.querySelector('.status').textContent='Treść zaznaczona. Naciśnij Ctrl+C, a następnie wklej w Gutenbergu.'}}</script></html>'''
document=document.replace('<script>', '''<script>async function copySeo(b){const text=b.parentElement.querySelector('span').textContent;try{await navigator.clipboard.writeText(text);b.closest('section').querySelector('.status').textContent='Pole SEO skopiowane.'}catch(e){const r=document.createRange();r.selectNodeContents(b.parentElement.querySelector('span'));const s=window.getSelection();s.removeAllRanges();s.addRange(r);b.closest('section').querySelector('.status').textContent='Pole zaznaczone. Naciśnij Ctrl+C.'}}''',1)
(ROOT/'RANK-MATH-SEO.txt').write_text('\n'.join(seo_text),encoding='utf-8')
(ROOT/'GOTOWE-WPISY.html').write_text(document,encoding='utf-8')
(ROOT/'missing-posts.json').write_text(json.dumps(inventory,ensure_ascii=False,indent=2),encoding='utf-8')

def paragraphs(p):
    tree=Parser(p['content']['rendered']).root
    return [norm(n.text()) for n in tree.walk() if n.tag=='p' and len(norm(n.text()))>80]
old=next(p for p in original if p['slug'] in aliases)
new=next(p for p in current if p['slug']==aliases[old['slug']])
a=paragraphs(old); b=paragraphs(new)
matches=sum(any(difflib.SequenceMatcher(None,x,y).ratio()>.94 for y in b) for x in a)
print(json.dumps({'original':len(original),'current':len(current),'missing':len(missing),'alias_original_paragraphs':len(a),'alias_matching_paragraphs':matches,'output_characters':sum(x['characters'] for x in inventory)},ensure_ascii=False))
for x in inventory: print(x['slug'], x['characters'])

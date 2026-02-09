import re
from pathlib import Path
from wordfreq import zipf_frequency, top_n_list

# configuração
LANG = "pt"
MAX_WORDS = 300_000
MIN_ZIPF = 3.0  # frequência mínima

OUT_PATH = Path("core/resources/pt_words.txt")

# regex que aceita letras + acentos do português
WORD_RE = re.compile(r"^[a-záéíóúâêôãõç]+$")

print("Carregando palavras do wordfreq...")

candidates = top_n_list(LANG, MAX_WORDS * 2)

words = []

for w in candidates:
    w = w.lower()

    if len(w) < 3:
        continue

    if not WORD_RE.match(w):
        continue

    if zipf_frequency(w, LANG) < MIN_ZIPF:
        continue

    words.append(w)

words = sorted(set(words))

print(f"Total final de palavras: {len(words)}")

OUT_PATH.parent.mkdir(parents=True, exist_ok=True)

with open(OUT_PATH, "w", encoding="utf-8") as f:
    for w in words:
        f.write(w + "\n")

print(f"Arquivo gerado em: {OUT_PATH}")

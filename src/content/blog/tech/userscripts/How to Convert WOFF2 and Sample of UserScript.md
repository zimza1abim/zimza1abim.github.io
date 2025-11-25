---
draft: false
title: "How to Convert WOFF2 and Sample of UserScript"
snippet: "woff2 형식의 폰트를 유저스크립트에 삽입하는 스크립트"
image: {
    src: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?&fit=crop&w=430&h=240",
    alt: "full stack web development"
}
category: "tech"
publishDate: "2025-08-11 14:13"
tags: [tech, userscript, woff2]
---

```js
// ==UserScript==
// @name         Custom Base64 Font
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Apply custom font (Base64 embedded) globally
// @match        *://*/*
// @run-at       document-start
// ==/UserScript==

(() => {
  const css = `
  @font-face {
    font-family: "MyFont";
    src: url("data:font/woff2;base64,${"여기에_전체_Base64_문자열"}") format("woff2");
    font-display: swap;
  }
  body, body *:not(code):not(pre) {
    font-family: "MyFont", sans-serif !important;
  }`;

  const style = document.createElement("style");
  style.textContent = css;
  document.documentElement.appendChild(style);
})();

<hr style="border: solid 2px blue; width: 50%; margin: 20px 0;">
```
---
```shell
pkg install woff2   # Termux (Ubuntu 계열이면 apt install woff2)
woff2_compress MyFont.ttf
base64 -w0 MyFont.woff2 > MyFont.b64
```
---
```shell
#!/usr/bin/env bash
# mac-solid-font2userscript.sh — macOS: (TTF/OTF) -> WOFF2 -> Base64 -> .user.js
# 사용:
#   brew install woff2      # 또는: pip3 install fonttools brotli
#   chmod +x mac-solid-font2userscript.sh
#   ./mac-solid-font2userscript.sh
# 결과: userscripts/<폰트이름>.user.js

set -euo pipefail
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

OUT_DIR="userscripts"
mkdir -p "$OUT_DIR"

have(){ command -v "$1" >/dev/null 2>&1; }

# --- Base64 인코딩 (줄바꿈 없음, 실패 시 폴백) ---
b64_encode() {
  local in="$1"
  if [[ -x /usr/bin/base64 ]]; then
    /usr/bin/base64 -b 0 "$in" && return 0
  fi
  if have openssl; then
    openssl base64 -A -in "$in" && return 0
  fi
  if have python3; then
    python3 - "$in" <<'PY'
import sys, base64, pathlib
p=pathlib.Path(sys.argv[1])
sys.stdout.write(base64.b64encode(p.read_bytes()).decode('ascii'))
PY
    return 0
  fi
  return 1
}

# --- TTF/OTF -> WOFF2 (여러 도구 폴백) ---
to_woff2() {
  local src="$1" out="$2" dir base name
  dir="$(dirname "$src")"; base="$(basename "$src")"; name="${base%.*}"
  if have woff2_compress; then
    woff2_compress "$src" >/dev/null 2>&1 || true
    [[ -s "${dir}/${name}.woff2" ]] && mv -f "${dir}/${name}.woff2" "$out" && return 0
  fi
  if have ttf2woff2; then
    ttf2woff2 -o "$out" "$src" >/dev/null 2>&1 || ttf2woff2 "$src" > "$out" 2>/dev/null || true
    [[ -s "$out" ]] && return 0
  fi
  if have pyftsubset; then
    pyftsubset "$src" --output-file="$out" --flavor=woff2 --layout-features='*' --glyphs='*' >/dev/null 2>&1 && return 0
  fi
  return 1
}

# --- JS 문자열용 이스케이프 (\", \\) ---
js_escape() {
  local s="$1"
  s="${s//\\/\\\\}"; s="${s//\"/\\\"}"
  printf '%s' "$s"
}

# --- 메인: .ttf/.otf 재귀 처리 ---
find . -type f \( -iname '*.ttf' -o -iname '*.otf' -o -iname '*.TTF' -o -iname '*.OTF' \) -print0 |
while IFS= read -r -d '' SRC; do
  BASENAME="$(basename "$SRC")"
  NAME_RAW="${BASENAME%.*}"
  NAME_ESC="$(js_escape "$NAME_RAW")"        # JS/ CSS에서 안전한 폰트 이름
  DIR="$(dirname "$SRC")"
  WOFF2_PATH="${DIR}/${NAME_RAW}.woff2"
  US_PATH="${OUT_DIR}/${NAME_RAW}.user.js"

  # 1) WOFF2 변환
  if ! to_woff2 "$SRC" "$WOFF2_PATH"; then
    echo "❌ WOFF2 변환 실패: $SRC" >&2
    continue
  fi
  [[ -s "$WOFF2_PATH" ]] || { echo "❌ 빈 WOFF2 출력: $WOFF2_PATH" >&2; continue; }

  # 2) Base64 인코딩
  B64_STR="$(b64_encode "$WOFF2_PATH")" || { echo "❌ base64 실패: $WOFF2_PATH" >&2; continue; }

  # 3) 유저스크립트 직접 쓰기 (큰 Base64도 안전, cat/sed/perl 불필요)
  {
    printf '%s\n' "// ==UserScript=="
    printf '%s\n' "// @name         ${NAME_RAW}-Font"
    printf '%s\n' "// @namespace    http://tampermonkey.net/"
    printf '%s\n' "// @version      1.0"
    printf '%s\n' "// @description  Apply custom font (Base64 embedded): ${NAME_RAW}"
    printf '%s\n' "// @match        *://*/*"
    printf '%s\n' "// @run-at       document-start"
    printf '%s\n' "// ==/UserScript=="
    printf '\n(() => {\n  const css = `\n'
    printf '  @font-face {\n'
    printf '    font-family: "%s";\n' "$NAME_ESC"
    printf '    src: url("data:font/woff2;base64,'

    # ★ 여기서 Base64를 그대로 이어서 출력 ★
    printf '%s' "$B64_STR"

    printf '") format("woff2");\n'
    printf '    font-display: swap;\n'
    printf '    /* unicode-range: U+0000-00FF, U+1100-11FF, U+3130-318F, U+AC00-D7A3, U+A960-A97F, U+D7B0-D7FF; */\n'
    printf '  }\n'
    printf '  html, body { font-family: "%s", sans-serif !important; }\n' "$NAME_ESC"
    printf '  body *:not(code):not(pre):not(kbd):not(samp):not(tt)\n'
    printf '         :not(.fa):not(.material-icons):not(svg):not(i[class*="icon"]) {\n'
    printf '    font-family: "%s", sans-serif !important;\n' "$NAME_ESC"
    printf '  }`;\n\n'
    printf '  const style = document.createElement("style");\n'
    printf '  style.textContent = css;\n'
    printf '  (document.head || document.documentElement).appendChild(style);\n'
    printf '})();\n'
  } > "$US_PATH"

  echo "✅ 생성: $US_PATH"
done

echo "🎉 완료: userscripts/ 폴더 확인"
```
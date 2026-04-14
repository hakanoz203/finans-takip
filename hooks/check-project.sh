#!/usr/bin/env bash
# ============================================================
#  PERİYODİK PROJE SAĞLIK KONTROLÜ — FinansIQ
#
#  Kullanım:
#    bash hooks/check-project.sh           → tam rapor
#    bash hooks/check-project.sh --fix     → otomatik düzelt
#    bash hooks/check-project.sh --json    → JSON çıktı (CI için)
#
#  Önerilen zamanlama (cron): 0 9 * * 1   (her Pazartesi 09:00)
# ============================================================

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
LOG_FILE="$ROOT/hooks/check-report.log"
AUTO_FIX=false
JSON_MODE=false

# Argüman işleme
for arg in "$@"; do
  case $arg in
    --fix)  AUTO_FIX=true ;;
    --json) JSON_MODE=true ;;
  esac
done

# Renk tanımları (JSON modda devre dışı)
if [ "$JSON_MODE" = false ]; then
  RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
  CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'
  PASS="${GREEN}✔${NC}"; FAIL="${RED}✖${NC}"; WARN="${YELLOW}⚠${NC}"
else
  RED=''; GREEN=''; YELLOW=''; CYAN=''; BOLD=''; NC=''
  PASS='OK'; FAIL='FAIL'; WARN='WARN'
fi

ISSUES=0
WARNINGS=0
declare -a REPORT_ITEMS=()

log() { echo -e "$1" | tee -a "$LOG_FILE"; }
add_item() { REPORT_ITEMS+=("$1"); }

cd "$ROOT"

if [ "$JSON_MODE" = false ]; then
  echo "" | tee "$LOG_FILE"
  log "${BOLD}${CYAN}╔══════════════════════════════════════════╗${NC}"
  log "${BOLD}${CYAN}║  FinansIQ — Proje Sağlık Kontrolü       ║${NC}"
  log "${BOLD}${CYAN}║  $TIMESTAMP                   ║${NC}"
  log "${BOLD}${CYAN}╚══════════════════════════════════════════╝${NC}"
  log ""
fi

# ── 1. Bağımlılık güvenliği ───────────────────────────────
log "${BOLD}[1/8] npm güvenlik taraması...${NC}"
AUDIT=$(npm audit --json 2>/dev/null || echo '{}')
CRITICAL=$(echo "$AUDIT" | grep -o '"critical":[0-9]*' | grep -o '[0-9]*' | head -1 || echo "0")
HIGH=$(echo "$AUDIT" | grep -o '"high":[0-9]*' | grep -o '[0-9]*' | head -1 || echo "0")
MODERATE=$(echo "$AUDIT" | grep -o '"moderate":[0-9]*' | grep -o '[0-9]*' | head -1 || echo "0")

if [ "${CRITICAL:-0}" -gt 0 ] || [ "${HIGH:-0}" -gt 0 ]; then
  log "  ${FAIL} Güvenlik açıkları: critical=${CRITICAL:-0} high=${HIGH:-0} moderate=${MODERATE:-0}"
  add_item "SECURITY: critical=${CRITICAL:-0} high=${HIGH:-0}"
  ISSUES=$((ISSUES + 1))
  if [ "$AUTO_FIX" = true ]; then
    log "  → npm audit fix çalışıyor..."
    npm audit fix --force 2>&1 | tail -3 | while read -r l; do log "    $l"; done
  fi
else
  log "  ${PASS} Güvenlik açığı yok (moderate=${MODERATE:-0})"
fi

# ── 2. Eski bağımlılıklar ─────────────────────────────────
log "${BOLD}[2/8] Eski bağımlılıklar kontrol ediliyor...${NC}"
OUTDATED=$(npm outdated --json 2>/dev/null || echo '{}')
OUTDATED_COUNT=$(echo "$OUTDATED" | grep -c '"current"' || echo "0")
if [ "${OUTDATED_COUNT:-0}" -gt 5 ]; then
  log "  ${WARN} ${OUTDATED_COUNT} eski bağımlılık var"
  add_item "OUTDATED: ${OUTDATED_COUNT} paket güncel değil"
  WARNINGS=$((WARNINGS + 1))
elif [ "${OUTDATED_COUNT:-0}" -gt 0 ]; then
  log "  ${WARN} ${OUTDATED_COUNT} bağımlılık güncellenebilir"
else
  log "  ${PASS} Tüm bağımlılıklar güncel"
fi

# ── 3. TypeScript derleme ─────────────────────────────────
log "${BOLD}[3/8] TypeScript tip kontrolü...${NC}"
TS_OUTPUT=$(npx tsc --noEmit --skipLibCheck 2>&1 || true)
TS_ERRORS=$(echo "$TS_OUTPUT" | grep -c "error TS" || echo "0")
if [ "${TS_ERRORS:-0}" -gt 0 ]; then
  log "  ${FAIL} ${TS_ERRORS} TypeScript hatası var"
  echo "$TS_OUTPUT" | head -5 | while read -r l; do log "    ${RED}$l${NC}"; done
  add_item "TYPESCRIPT: ${TS_ERRORS} tip hatası"
  ISSUES=$((ISSUES + 1))
else
  log "  ${PASS} TypeScript temiz"
fi

# ── 4. ESLint ─────────────────────────────────────────────
log "${BOLD}[4/8] ESLint kontrolü...${NC}"
LINT_OUTPUT=$(npx eslint "src/**/*.{ts,tsx}" --format=compact 2>&1 || true)
LINT_ERRORS=$(echo "$LINT_OUTPUT" | grep -c ": error " || echo "0")
LINT_WARNS=$(echo "$LINT_OUTPUT" | grep -c ": warning " || echo "0")
if [ "${LINT_ERRORS:-0}" -gt 0 ]; then
  log "  ${FAIL} ${LINT_ERRORS} ESLint hatası, ${LINT_WARNS} uyarı"
  add_item "ESLINT: ${LINT_ERRORS} hata ${LINT_WARNS} uyarı"
  ISSUES=$((ISSUES + 1))
elif [ "${LINT_WARNS:-0}" -gt 0 ]; then
  log "  ${WARN} ${LINT_WARNS} ESLint uyarısı"
  WARNINGS=$((WARNINGS + 1))
else
  log "  ${PASS} ESLint temiz"
fi

# ── 5. Production build ───────────────────────────────────
log "${BOLD}[5/8] Production build test...${NC}"
if npm run build > /tmp/finans_check_build.log 2>&1; then
  log "  ${PASS} Build başarılı"

  # Bundle boyutları
  JS_KB=$(find dist/assets -name "*.js" -exec wc -c {} + 2>/dev/null | tail -1 | awk '{printf "%.0f", $1/1024}' || echo "0")
  CSS_KB=$(find dist/assets -name "*.css" -exec wc -c {} + 2>/dev/null | tail -1 | awk '{printf "%.0f", $1/1024}' || echo "0")
  log "  ${PASS} Bundle: JS=${JS_KB}KB CSS=${CSS_KB}KB"

  if [ "${JS_KB:-0}" -gt 600 ]; then
    log "  ${WARN} JS bundle 600KB limitini aşıyor (${JS_KB}KB)"
    add_item "BUNDLE: JS ${JS_KB}KB > 600KB limit"
    WARNINGS=$((WARNINGS + 1))
  fi
else
  log "  ${FAIL} Build başarısız"
  tail -10 /tmp/finans_check_build.log | while read -r l; do log "    $l"; done
  add_item "BUILD: başarısız"
  ISSUES=$((ISSUES + 1))
fi

# ── 6. Kaynak dosya kalite kontrolleri ────────────────────
log "${BOLD}[6/8] Kod kalite kontrolleri...${NC}"

# console.log kalıntısı
CONSOLE_COUNT=$(grep -rE "console\.(log|debug)\s*\(" src/ 2>/dev/null | wc -l || echo "0")
if [ "${CONSOLE_COUNT:-0}" -gt 0 ]; then
  log "  ${WARN} ${CONSOLE_COUNT} adet console.log / debug kalıntısı"
  WARNINGS=$((WARNINGS + 1))
else
  log "  ${PASS} Debug kalıntısı yok"
fi

# TODO / FIXME sayısı
TODO_COUNT=$(grep -rEI "TODO|FIXME|HACK|XXX" src/ 2>/dev/null | wc -l || echo "0")
if [ "${TODO_COUNT:-0}" -gt 0 ]; then
  log "  ${WARN} ${TODO_COUNT} adet TODO/FIXME notu"
  WARNINGS=$((WARNINGS + 1))
else
  log "  ${PASS} Bekleyen TODO yok"
fi

# Çok uzun dosya (>400 satır)
LONG_FILES=$(find src \( -name "*.tsx" -o -name "*.ts" \) -type f | while read -r f; do
  LINES=$(wc -l < "$f" 2>/dev/null || echo 0)
  [ "$LINES" -gt 400 ] && echo "$f (${LINES} satır)"
done || true)
if [ -n "$LONG_FILES" ]; then
  log "  ${WARN} Uzun dosyalar (>400 satır):"
  echo "$LONG_FILES" | while read -r f; do log "      → $f"; done
  WARNINGS=$((WARNINGS + 1))
else
  log "  ${PASS} Tüm dosyalar makul uzunlukta"
fi

# ── 7. Git durumu ─────────────────────────────────────────
log "${BOLD}[7/8] Git durumu kontrol ediliyor...${NC}"
UNCOMMITTED=$(git status --porcelain 2>/dev/null | wc -l || echo "0")
AHEAD=$(git rev-list @{u}..HEAD 2>/dev/null | wc -l || echo "0")

if [ "${UNCOMMITTED:-0}" -gt 0 ]; then
  log "  ${WARN} ${UNCOMMITTED} commit edilmemiş değişiklik var"
  WARNINGS=$((WARNINGS + 1))
else
  log "  ${PASS} Çalışma dizini temiz"
fi

if [ "${AHEAD:-0}" -gt 5 ]; then
  log "  ${WARN} ${AHEAD} commit push edilmemiş durumda"
  add_item "GIT: ${AHEAD} commit bekliyor"
  WARNINGS=$((WARNINGS + 1))
elif [ "${AHEAD:-0}" -gt 0 ]; then
  log "  ${WARN} ${AHEAD} commit push bekleniyor"
else
  log "  ${PASS} Remote ile senkronize"
fi

# ── 8. node_modules / .env kontrolü ──────────────────────
log "${BOLD}[8/8] Gitignore uyumluluk kontrolü...${NC}"
IGNORED_TRACKED=$(git ls-files --cached node_modules .env dist 2>/dev/null | wc -l || echo "0")
if [ "${IGNORED_TRACKED:-0}" -gt 0 ]; then
  log "  ${FAIL} node_modules/.env/dist tracked state'de — .gitignore güncelle!"
  add_item "GITIGNORE: takip edilmemesi gereken dosyalar var"
  ISSUES=$((ISSUES + 1))
else
  log "  ${PASS} Gitignore uyumlu"
fi

# ── Özet rapor ────────────────────────────────────────────
log ""
log "${BOLD}${CYAN}══════════════════════════════════════════${NC}"
log "${BOLD}  RAPOR ÖZETI — $TIMESTAMP${NC}"
log "${BOLD}${CYAN}══════════════════════════════════════════${NC}"

if [ ${#REPORT_ITEMS[@]} -gt 0 ]; then
  for item in "${REPORT_ITEMS[@]}"; do
    log "  ${WARN} $item"
  done
  log ""
fi

if [ "$ISSUES" -gt 0 ]; then
  log "${BOLD}${RED}  ✖ HATALAR: $ISSUES  |  UYARILAR: $WARNINGS${NC}"
else
  log "${BOLD}${GREEN}  ✔ HATALAR: $ISSUES  |  UYARILAR: $WARNINGS${NC}"
fi
log "${BOLD}${CYAN}══════════════════════════════════════════${NC}"
log "  Detaylı rapor: hooks/check-report.log"
log ""

# JSON çıktı
if [ "$JSON_MODE" = true ]; then
  echo "{\"timestamp\":\"$TIMESTAMP\",\"errors\":$ISSUES,\"warnings\":$WARNINGS,\"items\":$(printf '%s\n' "${REPORT_ITEMS[@]}" | jq -R . | jq -s . 2>/dev/null || echo '[]')}"
fi

exit $ISSUES

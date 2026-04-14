#!/usr/bin/env bash
# ============================================================
#  HOOK KURULUM SCRİPTİ — FinansIQ
#
#  Kullanım: bash hooks/install-hooks.sh
#
#  hooks/ klasöründeki pre-commit ve pre-push dosyalarını
#  .git/hooks/ altına symlink olarak bağlar.
#  hooks/ dosyası güncellendikçe .git/hooks/ otomatik senkronize olur.
# ============================================================

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HOOKS_SRC="$ROOT/hooks"
HOOKS_DST="$ROOT/.git/hooks"

GREEN='\033[0;32m'; RED='\033[0;31m'; CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

echo ""
echo -e "${BOLD}${CYAN}══════════════════════════════════════${NC}"
echo -e "${BOLD}${CYAN}  FinansIQ Hook Kurulumu Başlıyor     ${NC}"
echo -e "${BOLD}${CYAN}══════════════════════════════════════${NC}"
echo ""

if [ ! -d "$HOOKS_DST" ]; then
  echo -e "${RED}Hata: .git/hooks dizini bulunamadı.${NC}"
  echo "Bu scripti proje kökünden çalıştır."
  exit 1
fi

install_hook() {
  local name="$1"
  local src="$HOOKS_SRC/$name"
  local dst="$HOOKS_DST/$name"

  if [ ! -f "$src" ]; then
    echo -e "  ${RED}✖ $name — kaynak bulunamadı: $src${NC}"
    return
  fi

  # Mevcut dosya (symlink değilse) yedekle
  if [ -e "$dst" ] && [ ! -L "$dst" ]; then
    cp "$dst" "${dst}.backup.$(date +%Y%m%d%H%M%S)"
    echo -e "  ${GREEN}→ Mevcut $name yedeklendi${NC}"
  fi

  # Symlink: hooks/pre-commit değişince .git/hooks/ otomatik güncellenir
  rm -f "$dst"
  ln -s "../../hooks/$name" "$dst"
  echo -e "  ${GREEN}✔ $name symlink → .git/hooks/$name${NC}"
}

install_hook "pre-commit"
install_hook "pre-push"

echo ""
echo -e "${BOLD}${GREEN}Kurulum tamamlandı!${NC}"
echo ""
echo -e "  ${CYAN}Çalışma testi:${NC}"
echo -e "    git commit -m \"test\"  → pre-commit çalışır"
echo -e "    git push               → pre-push çalışır"
echo ""
echo -e "  ${CYAN}Periyodik kontrol:${NC}"
echo -e "    bash hooks/check-project.sh"
echo ""
echo -e "  ${CYAN}Kurallar:${NC}"
echo -e "    hooks/RULES.md"
echo ""

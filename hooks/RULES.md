# FinansIQ — Proje Kuralları ve Standartları

Bu dosya; commit, push ve genel proje uyumluluğu için geçerli kuralları tanımlar.
Hook scriptleri bu kurallara dayanarak otomatik kontrol yapar.

---

## 1. GitHub'a Yükleme Kuralları (Pre-Push)

### 1.1 Zorunlu Geçişler (push durdurulur)

| Kural | Kontrol | Limit |
|-------|---------|-------|
| Production build başarılı olmalı | `npm run build` | hatasız |
| TypeScript hata olmamalı | `tsc --noEmit` | 0 hata |
| Merge conflict işareti olmamalı | `<<<<<<<` / `>>>>>>>` | 0 dosya |
| Kritik/yüksek güvenlik açığı olmamalı | `npm audit` | 0 critical/high |
| JS bundle boyutu | dist/assets/*.js | < 600 KB |

### 1.2 Uyarılar (push devam eder, log'a düşer)

| Kural | Açıklama |
|-------|----------|
| CSS bundle > 50KB | Tailwind purge ayarlarını kontrol et |
| 5'ten fazla push edilmemiş commit | `git push` sıklığını artır |

### 1.3 Kesinlikle Push Edilmeyecekler

```
node_modules/
dist/
.env
.env.local
.env.*.local
*.log
*.pem
*.key
```

> `.gitignore` dosyası bu listeden otomatik türetilmiştir.

---

## 2. Commit Kuralları (Pre-Commit)

### 2.1 Zorunlu Geçişler (commit durdurulur)

| Kural | Kontrol |
|-------|---------|
| Merge conflict işareti yok | staged dosyalarda `<<<<<<<` |
| Hassas veri yok | GitHub token, API key, şifre pattern'leri |
| TypeScript tip hatası yok | `tsc --noEmit` |
| Dosya boyutu < 1MB | Her staged dosya |

### 2.2 Uyarılar (commit devam eder)

| Kural | Açıklama |
|-------|----------|
| `console.log` kalıntısı | Prod'a taşınmadan temizle |
| ESLint uyarısı | `npx eslint src/` ile incele |
| `debugger;` ifadesi | Üretim kodunda bırakma |

### 2.3 Commit Mesajı Formatı

```
<tip>: <kısa açıklama>

[opsiyonel gövde]
```

**Tipler:**
- `feat:` — yeni özellik
- `fix:` — hata düzeltme
- `style:` — görsel/CSS değişikliği
- `refactor:` — yeniden yapılandırma
- `chore:` — bağımlılık/config güncellemesi
- `docs:` — dokümantasyon

**Örnekler:**
```
feat: gelir pasta grafiği eklendi
fix: sayfa yenilenince form sıfırlanmıyordu
style: header navbar yüksekliği düzenlendi
chore: chart.js 4.4.3 → 4.4.7 güncellendi
```

---

## 3. Kod Standartları

### 3.1 TypeScript

- Her bileşen `React.FC<Props>` tipiyle yazılmalı
- `any` tipi kullanılmamalı — `unknown` tercih et
- Tip tanımları `src/types/index.ts` içinde merkezi tutulmalı
- `import type` kullanımı zorunlu (verbatimModuleSyntax aktif)

### 3.2 Bileşen Kuralları

- Her bileşen tek bir dosyada, tek sorumlulukla
- Props interface'i bileşenin hemen üstünde tanımlanmalı
- 400 satırı geçen bileşenler parçalanmalı
- `useEffect` bağımlılık dizisi eksiksiz doldurulmalı

### 3.3 Stil Kuralları

- Inline stil yalnızca dinamik değerler için (`style={{ color: activeColor }}`)
- Statik stiller `index.css` veya Tailwind className ile
- CSS değişkenleri `var(--bg-card)` formatında kullanılmalı
- Yeni renk tanımlanacaksa `tailwind.config.js`'e eklenmeli

### 3.4 Dosya ve Klasör Yapısı

```
src/
├── components/   → Yeniden kullanılabilir UI bileşenleri
├── hooks/        → Custom React hook'ları
├── types/        → TypeScript tip tanımları
├── data/         → Statik / demo veriler
└── utils/        → Saf yardımcı fonksiyonlar
```

---

## 4. Periyodik Kontrol Kuralları (check-project.sh)

### 4.1 Önerilen Çalıştırma Sıklığı

| Durum | Komut | Sıklık |
|-------|-------|--------|
| Haftalık sağlık kontrolü | `bash hooks/check-project.sh` | Pazartesi sabahı |
| Büyük refactor öncesi | `bash hooks/check-project.sh` | Her seferinde |
| CI/CD ortamında | `bash hooks/check-project.sh --json` | Her PR'da |
| Otomatik düzeltme | `bash hooks/check-project.sh --fix` | Aylık |

### 4.2 Kontrol Edilenler

| # | Kontrol | Başarı Kriteri |
|---|---------|----------------|
| 1 | npm güvenlik taraması | critical=0, high=0 |
| 2 | Eski bağımlılıklar | < 5 outdated paket |
| 3 | TypeScript derleme | 0 tip hatası |
| 4 | ESLint | 0 hata, 0 uyarı |
| 5 | Production build | Başarılı |
| 6 | Bundle boyutu | JS < 600KB |
| 7 | Debug kalıntısı | 0 console.log |
| 8 | TODO/FIXME sayısı | 0 bekleyen not |
| 9 | Dosya uzunluğu | < 400 satır |
| 10 | Git senkronizasyonu | < 5 bekleyen commit |
| 11 | Gitignore uyumu | node_modules/dist track edilmiyor |

---

## 5. Uyumluluk Gereksinimleri

### 5.1 Node / npm

| Araç | Minimum Sürüm |
|------|--------------|
| Node.js | 18.x |
| npm | 9.x |
| TypeScript | 5.x |
| Vite | 5.x |

### 5.2 Tarayıcı Desteği

| Tarayıcı | Min Sürüm |
|----------|-----------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

> Not: IE desteği yok. Vite build hedefi: `es2015+`

### 5.3 Bağımlılık Uyumluluk Matrisi

| Paket | Sürüm | Önemli Not |
|-------|-------|------------|
| react | 19.x | Concurrent mode aktif |
| chart.js | 4.x | ArcElement register unutma |
| react-chartjs-2 | 5.x | chart.js 4 ile uyumlu |
| tailwindcss | 3.x | v4 migrate edilmedi |
| lucide-react | 0.x | tree-shaking aktif |

---

## 6. Hook Kurulum ve Yönetimi

### Kurulum (tek seferlik)

```bash
bash hooks/install-hooks.sh
```

### Belirli bir hook'u devre dışı bırakma

```bash
# Kalıcı devre dışı
mv .git/hooks/pre-commit .git/hooks/pre-commit.disabled

# Tek seferlik atlama (acil durum)
git commit --no-verify -m "acil fix"
git push --no-verify
```

### Hook güncelleme

```bash
# hooks/ klasöründe değişiklik yap, sonra:
bash hooks/install-hooks.sh
```

---

*Son güncelleme: 2026-04-14 | FinansIQ v1.0*

# FinansIQ — Claude Code Kalıcı Kurallar

Bu dosya her oturumda otomatik okunur. Kod yazmadan önce bu kuralları uygula.

---

## Proje Özeti

React 19 + TypeScript + Vite SPA. Gelir/gider takibi, Chart.js Doughnut grafik, Tailwind CSS dark theme. Backend yok — sadece React state.

**Canlı:** https://finans-takip-wheat.vercel.app  
**Repo:** https://github.com/hakanoz203/finans-takip

---

## Dosya Yapısı

```
src/
├── App.tsx                  ← Ana layout (grid)
├── index.css                ← CSS değişkenleri + global stiller
├── types/index.ts           ← Transaction, Category, Summary tipleri
├── data/dummyData.ts        ← 10 demo işlem
├── utils/format.ts          ← formatCurrency, formatCurrencyParts, formatDate
├── hooks/useTransactions.ts ← useState + chartData + incomeChartData
└── components/
    ├── Header.tsx            ← Navbar + net bakiye
    ├── SummaryCards.tsx      ← 3 metrik kart (count-up animasyonu)
    ├── PieChart.tsx          ← Gider/Gelir sekme toggle'lı Doughnut
    ├── AddTransaction.tsx    ← Form + validasyon
    ├── TransactionList.tsx   ← Tablo + silme animasyonu
    └── CategoryBadge.tsx     ← Emoji rozeti
```

---

## Kod Yazma Kuralları

### TypeScript
- `import type` zorunlu (verbatimModuleSyntax aktif)
- Yeni tipler `src/types/index.ts`'e eklenir
- `any` yasak — `unknown` kullan

### Stiller
- Dinamik değerler → `style={{ color: activeColor }}`
- Statik değerler → `className` veya `index.css`
- Yeni renk → `tailwind.config.js`'e ekle, CSS değişkeni tanımla
- Mevcut CSS değişkenleri: `--bg-primary/card/input`, `--accent-green/red/purple/blue`, `--text-primary/secondary/muted`, `--border/border-bright`

### Bileşenler
- Her bileşen `React.FC<Props>` tipinde
- Props interface bileşen üstünde
- 400 satır üstüne çıkma — parçala
- `useEffect` bağımlılık dizisi eksiksiz

### Sayı Gösterimi
- Para formatı: `formatCurrency()` veya `formatCurrencyParts()` — `src/utils/format.ts`
- Rakam fontu: `Inter` + `font-variant-numeric: tabular-nums`
- ₺ sembolü: küçük (15px), rakam büyük (28-30px)

---

## Token Verimliliği Kuralları

> Bu kurallar her kod yazımından sonra kontrol edilir.

### 1. Dosya Boyutu
- Tek bileşen dosyası **≤ 150 satır** hedefle (hard limit: 400)
- Yardımcı fonksiyon → `utils/`, tip → `types/`, sabit veri → `data/`
- Gereksiz yorum ekleme — iyi isimlendirme yeterli

### 2. Tekrar Eden Kod
- Aynı stil bloğu 3+ yerde → `index.css`'e `.glass-card` gibi class ekle
- Aynı hesaplama 2+ bileşende → `utils/` altına taşı
- Aynı JSX yapısı 2+ yerde → bileşene çıkar

### 3. State Yönetimi
- Türetilebilen değer için `useState` kullanma → `useMemo` ile hesapla
- Prop drilling 2 seviyeyi geçerse → hook'a taşı
- `useEffect` içinde state set etme (render'dan türetilebiliyorsa) → `useMemo`

### 4. Import Temizliği
- Kullanılmayan import bırakma
- Lucide icon: sadece kullanılan ikonları import et (tree-shaking)
- Chart.js: yalnızca register edilen modüller bundle'a girer

### 5. CSS Verimliliği
- Tailwind class'ları → utility-first, tekrar eden kombinasyonlar `@apply` ile
- Inline style sadece JavaScript değişkeni içerdiğinde
- `backdrop-filter: blur` — performans için `will-change: transform` ekleme (zaten GPU layer)

---

## Kod Yazıldıktan Sonra Uyumluluk Kontrolü

Her `Write` veya `Edit` işleminden sonra şu listeyi kontrol et ve sonucu raporla:

```
UYUMLULUK KONTROLÜ
==================
[ ] import type kullanıldı mı? (TS tipleri için)
[ ] Yeni CSS değişken mi? → tailwind.config.js'e eklendi mi?
[ ] Dosya 150 satır altında mı? (400 hard limit)
[ ] Tekrar eden mantık var mı? → utils/ veya component'e çıkar
[ ] console.log / debugger kaldı mı?
[ ] formatCurrency ile mi gösteriliyor? (ham sayı değil)
[ ] Lucide ikonları tek tek import edildi mi?
==================
Sonuç: ✔ Uyumlu / ⚠ [sorun varsa belirt]
```

---

## Git & Deploy Kuralları

- Her commit öncesi `hooks/pre-commit` otomatik çalışır
- Her push öncesi `hooks/pre-push` otomatik çalışır  
- Haftalık: `bash hooks/check-project.sh`
- Deploy: `vercel --prod --yes` (Vercel bağlı)
- Detaylı kurallar: `hooks/RULES.md`

---

## Sık Kullanılan Komutlar

```bash
npm run dev          # geliştirme sunucusu
npm run build        # production build
npx tsc --noEmit     # tip kontrolü
bash hooks/check-project.sh   # tam sağlık raporu
vercel --prod --yes  # deploy
```

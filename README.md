# FinansIQ — Kişisel Finans Takip Uygulaması

Gelir ve giderlerini anlık olarak takip et, kategorilere göre harcama dağılımını pasta grafikle görselleştir.

**Canlı Demo:** [finans-takip-wheat.vercel.app](https://finans-takip-wheat.vercel.app)

---

## Özellikler

- **Gelir / Gider Takibi** — Kategori, açıklama, tutar ve tarih ile işlem ekle
- **Anlık Özet Kartlar** — Toplam gelir, toplam gider ve net bakiye; easeOutExpo count-up animasyonu ile
- **Çift Grafik** — Gider ve gelir dağılımını ayrı sekmelerde Doughnut grafikle gör
- **İşlem Listesi** — Son 20 işlem, tarih sıralı; tek tıkla silme
- **Validasyon** — Eksik alan ve sıfır tutar uyarısı
- **Responsive** — Masaüstü, tablet ve mobil (min 320px) uyumlu
- **Türkçe Arayüz** — Tüm etiketler, kategoriler ve tarih formatları Türkçe

---

## Teknik Stack

| Katman | Teknoloji |
|--------|-----------|
| Framework | React 19 + Vite |
| Dil | TypeScript |
| Stil | Tailwind CSS v3 + CSS Variables |
| Grafik | Chart.js + react-chartjs-2 |
| İkonlar | lucide-react |
| State | React `useState` / `useMemo` (no backend) |
| Font | Inter (rakamlar) + Syne (başlıklar) |
| Deploy | Vercel |

---

## Kurulum

```bash
git clone https://github.com/hakanoz203/finans-takip.git
cd finans-takip
npm install
npm run dev
```

Uygulama `http://localhost:5173` adresinde açılır.

---

## Proje Yapısı

```
src/
├── App.tsx                   # Ana layout
├── main.tsx
├── index.css                 # Global stiller + CSS değişkenleri
├── types/
│   └── index.ts              # Transaction, Category, Summary tipleri
├── data/
│   └── dummyData.ts          # 10 adet demo işlem
├── utils/
│   └── format.ts             # formatCurrency, formatDate yardımcıları
├── hooks/
│   └── useTransactions.ts    # State + chartData + incomeChartData
└── components/
    ├── Header.tsx             # Navbar + net bakiye göstergesi
    ├── SummaryCards.tsx       # 3 metrik kart (gelir / gider / net)
    ├── PieChart.tsx           # Gider & Gelir sekme geçişli Doughnut grafik
    ├── AddTransaction.tsx     # Yeni işlem formu
    ├── TransactionList.tsx    # Sıralı işlem tablosu
    └── CategoryBadge.tsx      # Emoji kategori rozeti
```

---

## Kategoriler

**Gelir:** Maaş · Freelance · Yatırım · Diğer Gelir

**Gider:** Kira · Market · Ulaşım · Sağlık · Eğlence · Faturalar · Yemek · Diğer Gider

---

## Notlar

- **Backend yok** — tüm veri React state içinde; sayfa yenilenince demo veriler geri gelir.
- İleride eklenebilecekler: LocalStorage kalıcılığı, aylık filtreleme, CSV export, bütçe hedefi.

---

## Lisans

MIT

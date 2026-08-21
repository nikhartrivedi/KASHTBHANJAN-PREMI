import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generate() {
  const publicDir = path.join(process.cwd(), 'public');
  const svg192Path = path.join(publicDir, 'icon-192.svg');
  const svg512Path = path.join(publicDir, 'icon-512.svg');

  console.log('Generating 192x192 PNG...');
  await sharp(svg192Path)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));

  console.log('Generating 512x512 PNG...');
  await sharp(svg512Path)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));

  console.log('Generating maskable PNGs...');
  await sharp(svg192Path)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-maskable-192.png'));

  await sharp(svg512Path)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-maskable-512.png'));

  // Generate screenshot desktop (1280x720)
  console.log('Generating screenshot-desktop.png (1280x720)...');
  const desktopSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fffbeb"/>
        <stop offset="100%" stop-color="#fef3c7"/>
      </linearGradient>
      <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ea580c"/>
        <stop offset="50%" stop-color="#d97706"/>
        <stop offset="100%" stop-color="#c2410c"/>
      </linearGradient>
      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#fffdfa"/>
      </linearGradient>
      <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#7c2d12" flood-opacity="0.12"/>
      </filter>
    </defs>

    <!-- App Background -->
    <rect width="1280" height="720" fill="url(#bg)"/>

    <!-- Navbar -->
    <rect width="1280" height="72" fill="#ffffff" filter="url(#shadow)"/>
    <rect x="0" y="70" width="1280" height="2" fill="#f97316" opacity="0.3"/>
    
    <!-- Logo Badge -->
    <rect x="40" y="14" width="44" height="44" rx="10" fill="url(#headerGrad)"/>
    <text x="62" y="42" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="22" font-weight="900">卐</text>
    <text x="100" y="36" fill="#7c2d12" font-family="system-ui, sans-serif" font-size="18" font-weight="800">कष्टभंजन प्रेमी</text>
    <text x="100" y="52" fill="#ea580c" font-family="system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1">SUNDERKAND MANDAL</text>

    <!-- Nav Items -->
    <text x="500" y="42" fill="#ea580c" font-family="system-ui, sans-serif" font-size="14" font-weight="700">Home</text>
    <text x="580" y="42" fill="#475569" font-family="system-ui, sans-serif" font-size="14" font-weight="500">Sunderkand</text>
    <text x="700" y="42" fill="#475569" font-family="system-ui, sans-serif" font-size="14" font-weight="500">Bhajan Sangrah</text>
    <text x="840" y="42" fill="#475569" font-family="system-ui, sans-serif" font-size="14" font-weight="500">Mandal Events</text>
    <text x="980" y="42" fill="#475569" font-family="system-ui, sans-serif" font-size="14" font-weight="500">Gallery</text>

    <!-- Hero Card -->
    <rect x="40" y="104" width="1200" height="220" rx="20" fill="url(#headerGrad)" filter="url(#shadow)"/>
    <text x="80" y="160" fill="#fef08a" font-family="system-ui, sans-serif" font-size="14" font-weight="700" letter-spacing="2">॥ श्री कष्टभंजन देव प्रसन्न ॥</text>
    <text x="80" y="210" fill="#ffffff" font-family="system-ui, sans-serif" font-size="34" font-weight="900">कष्टभंजन प्रेमी सुंदरकांड मंडल</text>
    <text x="80" y="246" fill="#ffedd5" font-family="system-ui, sans-serif" font-size="16" font-weight="500">Devotional community portal for Sunderkand path, Bhajans lyrics, ceremonies &amp; booking</text>
    
    <!-- CTA Button on hero -->
    <rect x="80" y="270" width="180" height="38" rx="10" fill="#ffffff"/>
    <text x="170" y="294" text-anchor="middle" fill="#c2410c" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Book Sunderkand Path</text>

    <!-- 3 Cards Grid -->
    <g transform="translate(40, 350)">
      <!-- Card 1 -->
      <rect x="0" y="0" width="380" height="330" rx="16" fill="url(#cardGrad)" stroke="#fde68a" stroke-width="1.5" filter="url(#shadow)"/>
      <rect x="20" y="20" width="50" height="50" rx="12" fill="#ea580c" opacity="0.15"/>
      <text x="45" y="52" text-anchor="middle" fill="#ea580c" font-family="system-ui, sans-serif" font-size="22">📖</text>
      <text x="20" y="105" fill="#1e293b" font-family="system-ui, sans-serif" font-size="18" font-weight="800">संपूर्ण सुंदरकांड पाठ</text>
      <text x="20" y="130" fill="#64748b" font-family="system-ui, sans-serif" font-size="13">Complete chaupai recitation with Hindi arth, audio, and auto-scroller.</text>
      <rect x="20" y="270" width="340" height="38" rx="8" fill="#fff7ed" stroke="#fdba74" stroke-width="1"/>
      <text x="190" y="294" text-anchor="middle" fill="#c2410c" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Start Recitation →</text>

      <!-- Card 2 -->
      <rect x="410" y="0" width="380" height="330" rx="16" fill="url(#cardGrad)" stroke="#fde68a" stroke-width="1.5" filter="url(#shadow)"/>
      <rect x="430" y="20" width="50" height="50" rx="12" fill="#d97706" opacity="0.15"/>
      <text x="455" y="52" text-anchor="middle" fill="#d97706" font-family="system-ui, sans-serif" font-size="22">🎵</text>
      <text x="430" y="105" fill="#1e293b" font-family="system-ui, sans-serif" font-size="18" font-weight="800">भजन एवं आरती संग्रह</text>
      <text x="430" y="130" fill="#64748b" font-family="system-ui, sans-serif" font-size="13">100+ devotional lyrics of Lord Hanuman &amp; Shri Ram with Hindi chords.</text>
      <rect x="430" y="270" width="340" height="38" rx="8" fill="#fff7ed" stroke="#fdba74" stroke-width="1"/>
      <text x="600" y="294" text-anchor="middle" fill="#c2410c" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Browse Bhajans →</text>

      <!-- Card 3 -->
      <rect x="820" y="0" width="380" height="330" rx="16" fill="url(#cardGrad)" stroke="#fde68a" stroke-width="1.5" filter="url(#shadow)"/>
      <rect x="840" y="20" width="50" height="50" rx="12" fill="#16a34a" opacity="0.15"/>
      <text x="865" y="52" text-anchor="middle" fill="#16a34a" font-family="system-ui, sans-serif" font-size="22">🗓️</text>
      <text x="840" y="105" fill="#1e293b" font-family="system-ui, sans-serif" font-size="18" font-weight="800">आगामी मंडल कार्यक्रम</text>
      <text x="840" y="130" fill="#64748b" font-family="system-ui, sans-serif" font-size="13">Upcoming Sunderkand gatherings, dates, live seva bookings &amp; maps.</text>
      <rect x="840" y="270" width="340" height="38" rx="8" fill="#fff7ed" stroke="#fdba74" stroke-width="1"/>
      <text x="1010" y="294" text-anchor="middle" fill="#c2410c" font-family="system-ui, sans-serif" font-size="13" font-weight="700">View Schedule →</text>
    </g>
  </svg>
  `;

  await sharp(Buffer.from(desktopSvg))
    .resize(1280, 720)
    .png()
    .toFile(path.join(publicDir, 'screenshot-desktop.png'));

  // Generate screenshot mobile (720x1280)
  console.log('Generating screenshot-mobile.png (720x1280)...');
  const mobileSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="720" height="1280" viewBox="0 0 720 1280">
    <defs>
      <linearGradient id="mbg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fffbeb"/>
        <stop offset="100%" stop-color="#fef3c7"/>
      </linearGradient>
      <linearGradient id="mHeader" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ea580c"/>
        <stop offset="50%" stop-color="#d97706"/>
        <stop offset="100%" stop-color="#b45309"/>
      </linearGradient>
      <filter id="mShadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#7c2d12" flood-opacity="0.15"/>
      </filter>
    </defs>

    <!-- Mobile Background -->
    <rect width="720" height="1280" fill="url(#mbg)"/>

    <!-- Mobile Top Header -->
    <rect width="720" height="110" fill="url(#mHeader)"/>
    <rect x="30" y="32" width="48" height="48" rx="12" fill="#ffffff" opacity="0.2"/>
    <text x="54" y="64" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="24">卐</text>
    <text x="96" y="58" fill="#ffffff" font-family="system-ui, sans-serif" font-size="24" font-weight="800">कष्टभंजन प्रेमी</text>
    <text x="96" y="80" fill="#fef08a" font-family="system-ui, sans-serif" font-size="14" font-weight="600">सुंदरकांड मंडल</text>

    <!-- Hero Card Mobile -->
    <rect x="24" y="130" width="672" height="240" rx="20" fill="url(#mHeader)" filter="url(#mShadow)"/>
    <text x="50" y="180" fill="#fef08a" font-family="system-ui, sans-serif" font-size="14" font-weight="700" letter-spacing="2">॥ श्री हनुमते नमः ॥</text>
    <text x="50" y="225" fill="#ffffff" font-family="system-ui, sans-serif" font-size="30" font-weight="900">कष्टभंजन प्रेमी</text>
    <text x="50" y="265" fill="#ffedd5" font-family="system-ui, sans-serif" font-size="16">Sunderkand &amp; Devotional Portal</text>
    
    <rect x="50" y="295" width="220" height="48" rx="12" fill="#ffffff"/>
    <text x="160" y="326" text-anchor="middle" fill="#c2410c" font-family="system-ui, sans-serif" font-size="16" font-weight="800">Start Sunderkand ▶</text>

    <!-- Quick Stats -->
    <g transform="translate(24, 390)">
      <rect x="0" y="0" width="210" height="100" rx="14" fill="#ffffff" stroke="#fed7aa" filter="url(#mShadow)"/>
      <text x="105" y="45" text-anchor="middle" fill="#ea580c" font-family="system-ui, sans-serif" font-size="24" font-weight="800">108+</text>
      <text x="105" y="72" text-anchor="middle" fill="#64748b" font-family="system-ui, sans-serif" font-size="13" font-weight="600">Bhajan Lyrics</text>

      <rect x="231" y="0" width="210" height="100" rx="14" fill="#ffffff" stroke="#fed7aa" filter="url(#mShadow)"/>
      <text x="336" y="45" text-anchor="middle" fill="#d97706" font-family="system-ui, sans-serif" font-size="24" font-weight="800">60+</text>
      <text x="336" y="72" text-anchor="middle" fill="#64748b" font-family="system-ui, sans-serif" font-size="13" font-weight="600">Doha &amp; Chaupai</text>

      <rect x="462" y="0" width="210" height="100" rx="14" fill="#ffffff" stroke="#fed7aa" filter="url(#mShadow)"/>
      <text x="567" y="45" text-anchor="middle" fill="#16a34a" font-family="system-ui, sans-serif" font-size="24" font-weight="800">100%</text>
      <text x="567" y="72" text-anchor="middle" fill="#64748b" font-family="system-ui, sans-serif" font-size="13" font-weight="600">Offline Ready</text>
    </g>

    <!-- Main List Items -->
    <g transform="translate(24, 515)">
      <!-- Item 1 -->
      <rect x="0" y="0" width="672" height="140" rx="16" fill="#ffffff" stroke="#fde68a" stroke-width="1.5" filter="url(#mShadow)"/>
      <rect x="20" y="25" width="50" height="50" rx="12" fill="#ea580c" opacity="0.15"/>
      <text x="45" y="58" text-anchor="middle" fill="#ea580c" font-family="system-ui, sans-serif" font-size="24">📖</text>
      <text x="86" y="50" fill="#1e293b" font-family="system-ui, sans-serif" font-size="20" font-weight="800">सुंदरकांड पाठ</text>
      <text x="86" y="75" fill="#64748b" font-family="system-ui, sans-serif" font-size="13">Complete Sunderkand Path with audio and Hindi meaning</text>
      <text x="86" y="105" fill="#ea580c" font-family="system-ui, sans-serif" font-size="14" font-weight="700">Recite Now →</text>

      <!-- Item 2 -->
      <rect x="0" y="160" width="672" height="140" rx="16" fill="#ffffff" stroke="#fde68a" stroke-width="1.5" filter="url(#mShadow)"/>
      <rect x="20" y="185" width="50" height="50" rx="12" fill="#d97706" opacity="0.15"/>
      <text x="45" y="218" text-anchor="middle" fill="#d97706" font-family="system-ui, sans-serif" font-size="24">🪔</text>
      <text x="86" y="210" fill="#1e293b" font-family="system-ui, sans-serif" font-size="20" font-weight="800">हनुमान चालीसा व आरती</text>
      <text x="86" y="235" fill="#64748b" font-family="system-ui, sans-serif" font-size="13">Hanuman Chalisa, Bajrang Baan, Sankat Mochan &amp; Aarti</text>
      <text x="86" y="265" fill="#ea580c" font-family="system-ui, sans-serif" font-size="14" font-weight="700">Read Lyrics →</text>

      <!-- Item 3 -->
      <rect x="0" y="320" width="672" height="140" rx="16" fill="#ffffff" stroke="#fde68a" stroke-width="1.5" filter="url(#mShadow)"/>
      <rect x="20" y="345" width="50" height="50" rx="12" fill="#16a34a" opacity="0.15"/>
      <text x="45" y="378" text-anchor="middle" fill="#16a34a" font-family="system-ui, sans-serif" font-size="24">📅</text>
      <text x="86" y="370" fill="#1e293b" font-family="system-ui, sans-serif" font-size="20" font-weight="800">मंडल कार्यक्रम बुकिंग</text>
      <text x="86" y="395" fill="#64748b" font-family="system-ui, sans-serif" font-size="13">Book Sunderkand ceremony for family gatherings</text>
      <text x="86" y="425" fill="#ea580c" font-family="system-ui, sans-serif" font-size="14" font-weight="700">Book Ceremony →</text>

      <!-- Item 4 -->
      <rect x="0" y="480" width="672" height="140" rx="16" fill="#ffffff" stroke="#fde68a" stroke-width="1.5" filter="url(#mShadow)"/>
      <rect x="20" y="505" width="50" height="50" rx="12" fill="#ea580c" opacity="0.15"/>
      <text x="45" y="538" text-anchor="middle" fill="#ea580c" font-family="system-ui, sans-serif" font-size="24">🖼️</text>
      <text x="86" y="530" fill="#1e293b" font-family="system-ui, sans-serif" font-size="20" font-weight="800">फोटो दर्शन व गैलरी</text>
      <text x="86" y="555" fill="#64748b" font-family="system-ui, sans-serif" font-size="13">Salangpur Kashtabhanjan Dada darshan &amp; event photos</text>
      <text x="86" y="585" fill="#ea580c" font-family="system-ui, sans-serif" font-size="14" font-weight="700">View Darshan →</text>
    </g>

    <!-- Bottom Navigation Bar Mobile -->
    <rect y="1190" width="720" height="90" fill="#ffffff" filter="url(#mShadow)"/>
    <g transform="translate(0, 1200)">
      <text x="90" y="35" text-anchor="middle" fill="#ea580c" font-family="system-ui, sans-serif" font-size="20">🏠</text>
      <text x="90" y="55" text-anchor="middle" fill="#ea580c" font-family="system-ui, sans-serif" font-size="12" font-weight="700">Home</text>
      
      <text x="270" y="35" text-anchor="middle" fill="#64748b" font-family="system-ui, sans-serif" font-size="20">📖</text>
      <text x="270" y="55" text-anchor="middle" fill="#64748b" font-family="system-ui, sans-serif" font-size="12" font-weight="500">Sunderkand</text>
      
      <text x="450" y="35" text-anchor="middle" fill="#64748b" font-family="system-ui, sans-serif" font-size="20">🎵</text>
      <text x="450" y="55" text-anchor="middle" fill="#64748b" font-family="system-ui, sans-serif" font-size="12" font-weight="500">Bhajans</text>
      
      <text x="630" y="35" text-anchor="middle" fill="#64748b" font-family="system-ui, sans-serif" font-size="20">🗓️</text>
      <text x="630" y="55" text-anchor="middle" fill="#64748b" font-family="system-ui, sans-serif" font-size="12" font-weight="500">Events</text>
    </g>
  </svg>
  `;

  await sharp(Buffer.from(mobileSvg))
    .resize(720, 1280)
    .png()
    .toFile(path.join(publicDir, 'screenshot-mobile.png'));

  console.log('Done generating all assets!');
}

generate().catch(console.error);

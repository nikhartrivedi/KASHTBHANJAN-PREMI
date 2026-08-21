import { SunderkandCeremony, Bhajan, Announcement, CommunityPost, AccountingTransaction } from '../types';

export const INITIAL_SUNDERKAND_CEREMONIES: SunderkandCeremony[] = [
  {
    id: 'sund-1',
    title: '52nd Maha Sunderkand Path & Deepotsav',
    date: '2026-08-29', // Upcoming Saturday
    startTime: '08:30 PM',
    endTime: '11:30 PM',
    venue: 'Shree Kashtabhanjan Seva Prangan',
    address: 'Riwa Kirana Store, Nougama, Banswara, Rajasthan - 327603',
    googleMapsUrl: 'https://maps.google.com/?q=Nougama+Banswara+Rajasthan',
    description: 'Devotional collective Sunderkand path recital by SHREE KASHTBHANJAN PREMI Mandal with traditional dholak, harmonium, and majestic 108 Deepak Maha Aarti. All devotees and families are cordially invited.',
    hostName: 'Mandal Sanyojak & Bhakt Parivar',
    hostContact: '+91 77329 43851 / +91 97721 14039',
    photos: [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1609358905581-e5382c16a815?auto=format&fit=crop&w=800&q=80'
    ],
    notes: 'Mahaprasad (Bhojan) will be served immediately after the Maha Aarti at 11:30 PM. Please arrive 15 minutes before commencement.',
    status: 'upcoming',
    createdAt: '2026-08-15'
  },
  {
    id: 'sund-2',
    title: 'Shravan Special Sunderkand & Hanumanji Shringar',
    date: '2026-09-05',
    startTime: '08:00 PM',
    endTime: '11:00 PM',
    venue: 'Shree Kashtabhanjan Dev Prarthana Bhavan',
    address: 'Nougama, Banswara, Rajasthan - 327603',
    googleMapsUrl: 'https://maps.google.com/?q=Nougama+Banswara',
    description: 'Special auspicious Shravan Maas Sunderkand path accompanied by melodious bhajans of Lord Ram & Hanumanji with grand flower shringar darshan.',
    hostName: 'Mandal Sanyojak Samiti & Donors',
    hostContact: '+91 96362 23591',
    photos: [
      'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1604881991720-f91add269bed?auto=format&fit=crop&w=800&q=80'
    ],
    notes: 'Dry fruit prasad will be distributed to all attending bhaktas. Sunderkand books will be provided by the Mandal.',
    status: 'upcoming',
    createdAt: '2026-08-18'
  },
  {
    id: 'sund-3',
    title: '51st Akhand Sunderkand Samaroh (Shravan Pratipada)',
    date: '2026-08-15',
    startTime: '08:30 PM',
    endTime: '11:45 PM',
    venue: 'Community Bhavan Hall',
    address: 'Nougama, Banswara - 327603',
    googleMapsUrl: 'https://maps.google.com/?q=Nougama+Banswara',
    description: 'A divine evening attended by over 350 devotees with enthusiastic bhajan kirtan and devotional trance. 108 Diya Deepotsav was offered to Kashtabhanjan Dada.',
    hostName: 'Shree Bhakt Mandal Nougama',
    hostContact: '+91 77329 43851',
    photos: [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1609358905581-e5382c16a815?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80'
    ],
    notes: 'Ceremony successfully conducted with 350+ attendees. Annakshetra prasad distributed.',
    status: 'completed',
    createdAt: '2026-08-01'
  },
  {
    id: 'sund-4',
    title: '50th Golden Jubilee Sunderkand Utsav',
    date: '2026-08-01',
    startTime: '07:30 PM',
    endTime: '11:30 PM',
    venue: 'Shree Kashtabhanjan Dham Complex',
    address: 'Nougama, Banswara, Rajasthan - 327603',
    googleMapsUrl: 'https://maps.google.com/?q=Nougama+Banswara',
    description: 'Milestone 50th continuous Sunderkand celebration. Honoured founding members and long-term singers with memento and sacred Prasad.',
    hostName: 'SHREE KASHTBHANJAN PREMI Core Committee',
    hostContact: '+91 97721 14039',
    photos: [
      'https://images.unsplash.com/photo-1604881991720-f91add269bed?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80'
    ],
    notes: 'Record participation of 500+ devotees. Sunderkand books distributed.',
    status: 'completed',
    createdAt: '2026-07-20'
  }
];

export const INITIAL_BHAJANS: Bhajan[] = [
  {
    id: 'bhajan-1',
    title: 'Kashtbhanjan Dev Mara Sankat Harjo',
    gujaratiTitle: 'કષ્ટભંજન દેવ મારા સંકટ હરજો',
    hindiTitle: 'कष्टभंजन देव मारा संकट हरजो',
    category: 'Hanumanji',
    composer: 'Traditional Gujarati Devotional',
    ragaOrScale: 'Bilawal / D# Scale',
    isPopular: true,
    dateAdded: '2026-08-01',
    description: 'Soulful invocation to Shree Kashtabhanjan Hanumanji Maharaj of Sarangpur to remove all obstacles and distress.',
    lyrics: `(દોહા)
સાલંગપુરના શણગાર છો, દીનદુખીના આધાર છો,
કષ્ટભંજન હનુમાનજી, ભક્તોના તારણહાર છો.

(સ્થાયી)
કષ્ટભંજન દેવ મારા સંકટ હરજો,
સાલંગપુરના દાદા મારી લાજ રાખજો... (૨)
અમે આવ્યા તારે દ્વાર, દાદા કરો ઉદ્ધાર,
કષ્ટભંજન દેવ મારા સંકટ હરજો...

(અંતરો ૧)
હાથમાં ગદા અને સીંદૂરી અંગ છે,
રૂડાં સાલંગપુરમાં દાદા ભક્તિનો રંગ છે... (૨)
તારી ધજા લહેરાય, જય જયકાર થાય,
કષ્ટભંજન દેવ મારા સંકટ હરજો...

(અંતરો ૨)
શ્રી રામના તમે દૂત કહેવાયા,
સંકટ સમયે ભક્તોની વહારે તમે આવ્યા... (૨)
ચરણોમાં વંદન વારંવાર, દાદા આપો પ્યાર,
કષ્ટભંજન દેવ મારા સંકટ હરજો...

(અંતરો ૩)
દાદા તારા આશીર્વાદ સદા મારે માથે,
ચાલ્યા જઈએ અમે સદા સત્યની વાટે... (૨)
મંડળ કરે પોકાર, સુણો અરજી અમારી,
કષ્ટભંજન દેવ મારા સંકટ હરજો...`
  },
  {
    id: 'bhajan-2',
    title: 'Hanuman Chalisa (Complete 40 Chaupai)',
    gujaratiTitle: 'શ્રી હનુમાન ચાલીસા',
    hindiTitle: 'श्री हनुमान चालीसा',
    category: 'Hanumanji',
    composer: 'Goswami Tulsidasji',
    ragaOrScale: 'Traditional / C Scale',
    isPopular: true,
    dateAdded: '2026-07-20',
    description: 'The supreme 40-verse hymn in praise of Lord Hanuman, written by Goswami Tulsidasji.',
    lyrics: `॥ દોહા ॥
શ્રીગુરુ ચરન સરોજ રજ નિજ મનુ મુકુરુ સુધારી।
બરનઉઁ રઘુબર બિમલ જસુ જો દાયકુ ફલ ચારિ॥
બુદ્ધિહીન તનુ જાનિકે સુમિરૌં પવન-કુમાર।
બલ બુદ્ધિ બિદ્યા દેહુ મોહિં હરહુ કલેસ બિકાર॥

॥ ચોપાઈ ॥
જય હનુમાન જ્ઞાન ગુન સાગર। જય કપીસ તિહુઁ લોક ઉજાગર॥
રામદૂત અતુલિત બલ ધામા। અંજનિ-પુત્ર પવનસુત નામા॥
મહાબીર બિક્રમ બજરંગી। કુમતિ નિવાર સુમતિ કે સંગી॥
કંચન બરન બિરાજ સુબેસા। કાનન કુંડલ કુંચિત કેસા॥

હાથ બજ્ર ઔ ધ્વજા બિરાજૈ। કાઁધે મૂઁજ જનેઊ સાજૈ॥
સંકર સુવન કેસરીનંદન। તેજ પ્રતાપ મહા જગ બંદન॥
બિદ્યાવાન ગુની અતિ ચાતુર। રામ કાજ કરિબે કો આતુર॥
પ્રભુ ચરિત્ર સુનિબે કો રસિયા। રામ લખન સીતા મન બસિયા॥

સૂક્ષ્મ રૂપ ધરિ સિયહિં દિખાવા। બિકટ રૂપ ધરિ લંક જરાવા॥
ભીમ રૂપ ધરિ અસુર સંહારે। રામચંદ્ર કે કાજ સંવારે॥
લાય સજીવન લખન જિયાયે। શ્રીરઘુબીર હરષિ ઉર લાયે॥
રઘુપતિ કીન્હી બહુત બડ઼ાઈ। તુમ મમ પ્રિય ભરતહિ સમ ભાઈ॥

સહસ બદન તુમ્હરો જસ ગાવૈં। અસ કહિ શ્રીપતિ કંઠ લગાવૈં॥
સનકાદિક બ્રહ્માદિ મુનીસા। નારદ સારદ સહિત અહીસા॥
જમ કુબેર દિગપાલ જહાઁ તે। કબી કોબિદ કહિ સકે કહાઁ તે॥
તુમ ઉપકાર સુગ્રીવહિં કીન્હા। રામ મિલાય રાજ પદ દીન્હા॥

તુમ્હરો મંત્ર બિભીષન માના। લંકેસ્વર ભયે સબ જગ જાના॥
જુગ સહસ્ર જોજન પર ભાનૂ। લીલ્યો તાહિ મધુર ફલ જાનૂ॥
પ્રભુ મુદ્રિકા મેલિ મુખ માહીં। જલધિ લાંઘિ ગયે અચરજ નાહીં॥
દુર્ગમ કાજ જગત કે જેતે। સુગમ અનુગ્રહ તુમ્હરે તેતે॥

રામ દુઆરે તુમ રખવારે। હોત ન આજ્ઞા બિનુ પૈસારે॥
સબ સુખ લહૈ તુમ્હારી સરના। તુમ રક્ષક કાહૂ કો ડર ના॥
આપન તેજ સમ્હારો આપૈ। તીનોં લોક હાઁક તેઁ કાઁપૈ॥
ભૂત પિસાચ નિકટ નહિં આવૈ। મહાબીર જબ નામ સુનાવૈ॥

નાસૈ રોગ હરૈ સબ પીરા। જપત નિરંતર હનુમત બીરા॥
સંકટ તેં હનુમાન છુડ઼ાવૈ। મન ક્રમ બચન ધ્યાન જો લાવૈ॥
સબ પર રામ તપસ્વી રાજા। તિન કે કાજ સકલ તુમ સાજા॥
ઔર મનોરથ જો કોઈ લાવૈ। સોઈ અમિત જીવન ફલ પાવૈ॥

ચારોં જુગ પરતાપ તુમ્હારા। હૈ પરસિદ્ધ જગત ઉજિયારા॥
સાધુ-સંત કે તુમ રખવારે। અસુર નિકંદન રામ દુલારે॥
અષ્ટ સિદ્ધિ નૌ નિધિ કે દાતા। અસ બર દીન જાનકી માતા॥
રામ રસાયન તુમ્હરે પાસા। સદા રહો રઘુપતિ કે દાસા॥

તુમ્હરે ભજન રામ કો ભાવૈ। જનમ-જનમ કે દુખ બિસરાવૈ॥
અન્તકાલ રઘુબર પુર જાઈ। જહાઁ જન્મ હરિ-ભક્ત કહાઈ॥
ઔર દેવતા ચિત્ત ન ધરઈ। હનુમત સેઈ સર્બ સુખ કરઈ॥
સંકટ કટૈ મિટૈ સબ પીરા। જો સુમિરૈ હનુમત બલબીરા॥

જય જય જય હનુમાન ગોસાઈં। કૃપા કરહુ ગુરુદેવ કી નાઈં॥
જો સત બાર પાઠ કર કોઈ। છૂટહિ બંદિ મહા સુખ होई॥
જો યહ પઢ઼ૈ હનુમાન ચાલીસા। હોય સિદ્ધિ સાખી ગૌરીસા॥
તુલસીદાસ સદા હરિ ચેરા। કીજૈ નાથ હૃદય મહઁ ડેરા॥

॥ દોહા ॥
પવનતનય સંકટ હરન મંગલ મૂરતિ રૂપ।
રામ લખન સીતા સહિત હૃદય બસહુ સુર ભૂપ॥`
  },
  {
    id: 'bhajan-3',
    title: 'Mangal Murti Maruti Nandan',
    gujaratiTitle: 'મંગલ મૂર્તિ મારુતિ નંદન સકલ અમંગલ મૂલ નિકંદન',
    hindiTitle: 'मंगल मूर्ति मारुति नंदन सकल अमंगल मूल निकंदन',
    category: 'Hanumanji',
    composer: 'Tulsidasji / Classical Bhajan',
    ragaOrScale: 'Bhairavi / G Scale',
    isPopular: true,
    dateAdded: '2026-07-25',
    description: 'Devotional song describing the divine strength, purity, and benevolence of Lord Maruti.',
    lyrics: `મંગલ મૂર્તિ મારુતિ નંદન,
સકલ અમંગલ મૂલ નિકંદન... (૨)
પવન તનય સંતન હિતકારી,
હૃદય બિરાજત અવધ બિહારી...

અંજની પુત્ર પવન સુત નામા,
જય જય જય સિયારામ કે ધામા...
સુમિરન કરત કલેશ બિનાસે,
સુખ સંપતિ ઘર આય પ્રકાશે...

ચારુ શીલ ચંદન તન સોહૈ,
સુર મુનિ જન મન સબકો મોહૈ...
કષ્ટભંજન જય સાલંગપુર વાલા,
ભક્ત જનો કે તારણહારા...

મંગલ મૂર્તિ મારુતિ નંદન,
સકલ અમંગલ મૂલ નિકંદન...`
  },
  {
    id: 'bhajan-4',
    title: 'Aarti Kije Hanuman Lala Ki',
    gujaratiTitle: 'આરતી કીજે હનુમાન લલા કી',
    hindiTitle: 'आरती कीजै हनुमान लला की',
    category: 'Aarti',
    composer: 'Sant Ramanandji',
    ragaOrScale: 'Traditional Aarti',
    isPopular: true,
    dateAdded: '2026-07-15',
    description: 'The supreme traditional Aarti recited at the conclusion of every Sunderkand Path.',
    lyrics: `આરતી કીજૈ હનુમાન લલા કી।
દુષ્ટ દલન રઘુનાથ કલા કી॥

જાકે બલ સે ગિરિવર કાંપૈ।
રોગ દોષ જાકે નિકટ ન ઝાંપૈ॥
અંજની પુત્ર મહા બલદાયી।
સંતન કે પ્રભુ સદા સહાઈ॥

દે બીરા રઘુનાથ પઠાએ।
લંકા જારી સિયા સુધિ લાએ॥
લંકા સો કોટ સમુદ્ર સી ખાઈ।
જાત પવનસુત બાર ન લાઈ॥

લંકા જારી અસુર સંહારે।
સિયા રામજી કે કાજ સંવારે॥
લક્ષ્મણ મૂર્છિત પડે સકારે।
આનિ સજીવન પ્રાન ઉબારે॥

પૈઠિ પતાલ તોરિ જમકારે।
અહિરાવન કી ભુજા ઉખારે॥
બાએં ભુજા અસુર દલ મારે।
દાહિને ભુજા સંત જન તારે॥

સુર નર મુનિ આરતી ઉતારૈં।
જય જય જય હનુમાન ઉચારૈં॥
કંચન થાર કપૂર લૌ છાઈ।
આરતી કરત અંજના માઈ॥

જો હનુમાનજી કી આરતી ગાવૈ।
બસિ બૈકુંઠ પરમ પદ પાવૈ॥
આરતી કીજૈ હનુમાન લલા કી।
દુષ્ટ દલન રઘુનાથ કલા કી॥`
  },
  {
    id: 'bhajan-5',
    title: 'Shree Ramchandra Kripalu Bhaju Man',
    gujaratiTitle: 'શ્રી રામચંદ્ર કૃપાલુ ભજુ મન',
    hindiTitle: 'श्री रामचंद्र कृपालु भजु मन हरण भवभय दारुणं',
    category: 'Ramji',
    composer: 'Goswami Tulsidasji',
    ragaOrScale: 'Raga Yaman / C#',
    isPopular: true,
    dateAdded: '2026-08-05',
    description: 'Divine Ram Stuti praising the lotus-eyed Lord Ramachandra, sung during Sunderkand samaroh.',
    lyrics: `શ્રી રામચંદ્ર કૃપાલુ ભજુ મન હરણ ભવભય દારુણં।
નવકંજ લોચન, કંજ મુખ, કર કંજ, પદ કંજારુણં॥

કંદર્પ અગણિત અમિત છબિ, નવનીલ નીરદ સુંદરં।
પટ પીત માનહુ તડિત રુચિ શુચિ નૌમિ જનક સુતાવરં॥

ભજુ દીનબંધુ દિનેશ દાનવ દૈત્ય વંશ નિકંદનં।
રઘુનંદ આનન્દકંદ કોશલ ચંદ દશરથ નંદનં॥

સિર મુકુટ કુંડલ તિલક ચારુ ઉદારુ અંગ વિભૂષણં।
આજાનુભુજ શર ચાપ ધર, સંગ્રામ-જિત-ખર દૂષણં॥

ઇતિ વદતિ તુલસીદાસ શંકર શેષ મુનિ મન રંજં।
મમ હૃદય કંજ નિવાસ કુરુ, કામાદિ ખલ દલ ગંજનં॥`
  },
  {
    id: 'bhajan-6',
    title: 'Dholak Dhoon & Mahamantra (Hare Ram Hare Krishna)',
    gujaratiTitle: 'મંડળ સંકીર્તન ધૂન',
    hindiTitle: 'मंडल संकीर्तन धून',
    category: 'Dhoon',
    composer: 'Mandal Samiti',
    ragaOrScale: 'Fast Keharwa',
    isPopular: false,
    dateAdded: '2026-08-10',
    description: 'Fast paced rhythmic dhoon recited between Sunderkand chapters with clapping.',
    lyrics: `શ્રી રામ જય રામ જય જય રામ... (૪)
જય જય હનુમાન, જય કષ્ટભંજન,
જય સાલંગપુર વાલા હનુમાન...

હરે રામ હરે રામ, રામ રામ હરે હરે,
હરે કૃષ્ણ હરે કૃષ્ણ, કૃષ્ણ કૃષ્ણ હરે હરે...

પવનતનય બલ ધામ, રામ દૂત ગુણવાન,
કરો અમારો કલ્યાણ, ઓ સાલંગપુર ના હનુમાન...`
  },
  {
    id: 'bhajan-7',
    title: 'Thal: Jamo Thali Bharine Lai Re (Sarangpur Dada Thal)',
    gujaratiTitle: 'થાળ: જમો થાળી ભરીને લાવી રે દાદા',
    hindiTitle: 'थाल: जमो थाली भरीने लावी रे दादा',
    category: 'Thal',
    composer: 'Devotee Traditional',
    ragaOrScale: 'Kafi / D Scale',
    isPopular: true,
    dateAdded: '2026-08-12',
    description: 'Traditional Gujarati Mahaprasad offering Thal sung before Annakshetra and Aarti.',
    lyrics: `જમો થાળી ભરીને લાવી રે દાદા મારા કષ્ટભંજના...
ભાવે કરીને જમો રે દાદા, પ્રેમથી અર્પણ કરું...

મોતીચૂર લાડુ ને ઘીના શીરા,
કાજુ બદામ પિસ્તા મીઠા મેવા...
કેસરિયું દૂધપાક ને પૂરી ગરમાગરમ,
જમો મારા વાલા સાલંગપુરના નાથ...

જળ જમુનાની ઝારી ભરી લાવ્યા,
મુખવાસમાં એલચી લવિંગ લાવી...
સંતો મહંતો ને ભક્તો મળીને,
પ્રેમે કરે છે થાળ સમર્પણ...

જમો થાળી ભરીને લાવી રે દાદા મારા કષ્ટભંજના...`
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'आगामी 52वां महा सुंदरकांड पाठ एवं 108 दीपक महाआरती',
    content: 'समस्त भक्तजनों को सूचित किया जाता है कि शनिवार को सायं 8:30 बजे से रीवा किराना स्टोर प्रांगण, नौगामा में 52वां सुंदरकांड पाठ व महाआरती आयोजित होगी। आप सभी सपरिवार सादर आमंत्रित हैं।',
    date: '2026-08-20',
    isPinned: true,
    isUrgent: false,
    category: 'Sunderkand',
    author: 'श्री कष्टभंजन प्रेमी मंडल समिति'
  },
  {
    id: 'ann-2',
    title: 'सारंगपुर धाम पदयात्रा सेवा व पंजीकरण सूचना',
    content: 'सारंगपुर कष्टभंजन देव दर्शन पदयात्रा हेतु इच्छुक भक्तजन अपना नाम मंडल कार्यालय में दर्ज करवाएं। पदयात्रियों के भोजन व प्राथमिक उपचार की निःशुल्क व्यवस्था रहेगी।',
    date: '2026-08-16',
    isPinned: false,
    isUrgent: false,
    category: 'Mandal Notice',
    author: 'कार्यालय प्रमुख'
  }
];

export const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    title: 'श्री कष्टभंजन देव सारंगपुर दिव्य विचार',
    thought: 'जिसके हृदय में श्री राम और हनुमान जी का वास है, उसे संसार का कोई भी संकट विचलित नहीं कर सकता। हर शनिवार सुंदरकांड पाठ करें और प्रभु की कृपा प्राप्त करें।\n\n॥ संकट कटे मिटे सब पीरा, जो सुमिरे हनुमत बलबीरा ॥',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    authorName: 'श्री कष्टभंजन प्रेमी मंडल',
    authorRole: 'मंडल परिवार',
    date: '2026-08-20',
    likesCount: 24,
    tags: ['सुविचार', 'हनुमानजी', 'सारंगपुर'],
    createdAt: '2026-08-20'
  },
  {
    id: 'post-2',
    title: 'नित्य सेवा और समर्पण का भाव',
    thought: 'सेवा ही सबसे बड़ा धर्म है। जब हम निस्वार्थ भाव से मंडल के सुंदरकांड व अन्नक्षेत्र में सहयोग करते हैं, तो दादा कष्टभंजन हमारे जीवन के सारे कष्ट हर लेते हैं।',
    imageUrl: 'https://images.unsplash.com/photo-1609358905581-e5382c16a815?auto=format&fit=crop&w=800&q=80',
    authorName: 'भक्त सेवक',
    authorRole: 'नौगामा',
    date: '2026-08-18',
    likesCount: 18,
    tags: ['सेवा', 'भक्ति', 'प्रेरणा'],
    createdAt: '2026-08-18'
  },
  {
    id: 'post-3',
    title: 'दीपक महाआरती एवं सत्संग महिमा',
    thought: 'सत्संग से जीवन को सही दिशा मिलती है। 108 दीपक महाआरती के दर्शन मात्र से अंतर्मन में शांति और सकारात्मक ऊर्जा का संचार होता है। जय श्री कष्टभंजन दादा!',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    authorName: 'संजय भाई पटेल',
    authorRole: 'भक्त',
    date: '2026-08-15',
    likesCount: 31,
    tags: ['महाआरती', 'सत्संग', 'जयहनुमान'],
    createdAt: '2026-08-15'
  }
];

export const INITIAL_TRANSACTIONS: AccountingTransaction[] = [
  {
    id: 'acc-1',
    type: 'income',
    title: 'श्री सुंदरकांड पाठ हेतु गुप्त दान (भेंट)',
    amount: 11000,
    category: 'Donation (Bhet/Daan)',
    date: '2026-08-19',
    donorOrReceiverName: 'श्री राम भक्त परिवार, नौगामा',
    paymentMode: 'UPI/Online',
    receiptNo: 'REC-2026-089',
    notes: '52वें सुंदरकांड पाठ महाप्रसाद हेतु भेंट',
    recordedBy: 'Admin (Mandal Koshadhyaksh)',
    createdAt: '2026-08-19'
  },
  {
    id: 'acc-2',
    type: 'income',
    title: '108 दीपक महाआरती तेल व बाती सहयोग',
    amount: 5100,
    category: 'Sunderkand Seva',
    date: '2026-08-18',
    donorOrReceiverName: 'हर्षद भाई सेवक',
    paymentMode: 'Cash',
    receiptNo: 'REC-2026-088',
    notes: 'दीपोत्सव व धूप सामग्री',
    recordedBy: 'Admin',
    createdAt: '2026-08-18'
  },
  {
    id: 'acc-3',
    type: 'expense',
    title: 'महाप्रसाद (खीर-पूरी व भोजन) सामग्री खर्च',
    amount: 7850,
    category: 'Prasad & Bhandara',
    date: '2026-08-16',
    donorOrReceiverName: 'श्रीनाथ किराना एवं डेयरी भंडार',
    paymentMode: 'UPI/Online',
    receiptNo: 'BILL-4421',
    notes: '51वें पाठ के 350+ भक्तों हेतु महाप्रसाद',
    recordedBy: 'Admin',
    createdAt: '2026-08-16'
  },
  {
    id: 'acc-4',
    type: 'expense',
    title: 'साउंड सिस्टम, माइक व ढोलक कलाकार मानदेय',
    amount: 3500,
    category: 'Sound & Dholak',
    date: '2026-08-15',
    donorOrReceiverName: 'राधे साउंड सर्विस, नौगामा',
    paymentMode: 'Cash',
    receiptNo: 'VOUCH-102',
    notes: 'सुंदरकांड संगीतमय व्यवस्था',
    recordedBy: 'Admin',
    createdAt: '2026-08-15'
  },
  {
    id: 'acc-5',
    type: 'income',
    title: 'सारंगपुर पदयात्रा सेवा निधि सहयोग',
    amount: 21000,
    category: 'Padyatra',
    date: '2026-08-12',
    donorOrReceiverName: 'मण्डल हितैषी दानदाता ग्रुप',
    paymentMode: 'Bank Transfer',
    receiptNo: 'REC-2026-085',
    notes: 'पदयात्रियों के जलपान व प्राथमिक चिकित्सा व्यवस्था',
    recordedBy: 'Admin',
    createdAt: '2026-08-12'
  }
];


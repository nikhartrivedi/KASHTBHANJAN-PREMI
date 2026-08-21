import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini SDK with server-side API Key
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Gemini AI Bhajan Search & Lyrics Extraction Endpoint with Multi-Model Fallback & Retry
  app.post('/api/gemini/generate-bhajan', async (req, res) => {
    try {
      const { prompt, category, languageHint } = req.body;
      if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
        return res.status(400).json({ error: 'कृपया भजन का नाम, बोल या मुखड़ा लिखें या बोलें।' });
      }

      const systemInstruction = `आप श्री कष्टभंजन प्रेमी मंडल (नौगामा, बांसवाड़ा) के एक अत्यंत प्रामाणिक, अनुभवी एवं ज्ञानवान भजन व सुंदरकांड संगीतज्ञ हैं।
आपका मुख्य कार्य यह है कि जब भी कोई भक्त या एडमिन किसी भी भजन का नाम, बोल, मुखड़ा, गायक या ऑडियो से बोला गया टेक्स्ट दे:
1. उस भजन को सटीक रूप से पहचानें और उसकी वास्तविक, प्रामाणिक व पूरी लिरिक्स (स्थायी, सभी अंतरा, दोहा, चौपाई, छंद) शुद्ध देवनागरी (Hindi) और आवश्यकतानुसार गुजराती में प्रस्तुत करें।
2. यदि वह कोई प्रसिद्ध पारंपरिक या फिल्मी/संत भजन है (जैसे कबीर, सूरदास, तुलसीदास, मीराबाई, लखमसी, नारायण स्वामी, हेमन्त चौहान, अनूप जलोटा, अनुराधा पौडवाल, लखबीर सिंह लक्खा आदि द्वारा गाया हुआ), तो उसके सभी अंतरे पूरे और सही क्रम में दें (अधूरा न छोड़ें)।
3. सटीक श्रेणी चुनें: 'Hanumanji' | 'Ramji' | 'Sunderkand Stuti & Doha' | 'Aarti' | 'Thal' | 'Dhoon' | 'Shivji' | 'Krishna'।
4. रचयिता/संत का नाम तथा उपयुक्त राग/स्केल (उदा. राग भैरवी / C# Scale / दादरा ताल / कहरवा ताल) स्पष्ट रूप से बताएं।
5. 1-2 पंक्तियों में सुंदर भावार्थ व महात्म्य दें।`;

      const contents = `भजन का नाम/बोल पहचानें और उसकी पूरी प्रामाणिक लिरिक्स दें: "${prompt.trim()}" ${category && category !== 'All' ? `(श्रेणी: ${category})` : ''} ${languageHint ? `(भाषा: ${languageHint})` : ''}`;

      const schemaConfig = {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hindiTitle: {
              type: Type.STRING,
              description: 'भजन का शुद्ध शीर्षक (हिंदी/देवनागरी में)',
            },
            category: {
              type: Type.STRING,
              description: 'श्रेणी (Hanumanji, Ramji, Sunderkand Stuti & Doha, Aarti, Thal, Dhoon, Shivji, Krishna में से सबसे उपयुक्त)',
            },
            lyrics: {
              type: Type.STRING,
              description: 'भजन के संपूर्ण बोल (स्थायी, सभी अंतरे, दोहा व चौपाई क्रमबद्ध पंक्तियों में)',
            },
          },
          required: ['hindiTitle', 'category', 'lyrics'],
        },
      };

      // Reliable Google GenAI model fallback cascade
      const candidateModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
      let lastError: any = null;
      let parsedResult: any = null;

      for (const modelName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents,
            config: schemaConfig,
          });

          if (response.text) {
            parsedResult = JSON.parse(response.text);
            if (parsedResult.hindiTitle && parsedResult.lyrics) {
              break;
            }
          }
        } catch (err: any) {
          lastError = err;
          console.warn(`Gemini generation on model ${modelName} encountered: ${err?.message || err}. Trying next fallback...`);
          await new Promise((resolve) => setTimeout(resolve, 400));
        }
      }

      if (!parsedResult) {
        throw lastError || new Error('भजन लिरिक्स प्राप्त नहीं हो सके।');
      }

      return res.json({ success: true, bhajan: parsedResult });
    } catch (error: any) {
      console.error('Error searching and generating bhajan with Gemini:', error);
      let userFriendlyMessage = 'भजन खोजने में समस्या आई, कृपया मैन्युअल रूप से "नया भजन जोड़ें" बटन से जोड़ें।';
      if (error?.message?.includes('503') || error?.message?.includes('UNAVAILABLE') || error?.message?.includes('high demand')) {
        userFriendlyMessage = 'AI सर्वर व्यस्त है। आप सीधे "नया भजन जोड़ें" पर क्लिक करके सिर्फ शीर्षक, श्रेणी और लिरिक्स डालकर भजन जोड़ सकते हैं।';
      }
      return res.status(500).json({ error: userFriendlyMessage, details: error?.message });
    }
  });

  // Vite middleware for development / Static file serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

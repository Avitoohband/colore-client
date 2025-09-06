import { NextRequest, NextResponse } from 'next/server'

// Language mapping for LibreTranslate API
const languageMapping: Record<string, string> = {
  'en': 'en',
  'es': 'es',
  'fr': 'fr',
  'de': 'de',
  'it': 'it',
  'pt': 'pt',
  'ru': 'ru',
  'ja': 'ja',
  'ko': 'ko',
  'zh': 'zh',
  'ar': 'ar',
  'he': 'he',
  'hi': 'hi',
  'th': 'th',
  'vi': 'vi',
  'nl': 'nl',
  'sv': 'sv',
  'da': 'da',
  'no': 'no',
  'fi': 'fi'
}

// Try multiple LibreTranslate instances
const LIBRETRANSLATE_INSTANCES = [
  'https://libretranslate.de/translate',
  'https://translate.argosopentech.com/translate',
  'https://libretranslate.com/translate'
]

async function translateWithLibreTranslate(text: string, targetLang: string): Promise<string> {
  const mappedLang = languageMapping[targetLang] || targetLang
  
  for (const instance of LIBRETRANSLATE_INSTANCES) {
    try {
      console.log(`Trying LibreTranslate instance: ${instance}`)
      
      const response = await fetch(instance, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: 'auto', // Auto-detect source language
          target: mappedLang,
          format: 'text'
        }),
        signal: AbortSignal.timeout(10000) // 10 second timeout
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.translatedText) {
        console.log(`Translation successful with ${instance}`)
        return data.translatedText
      } else {
        throw new Error('No translatedText in response')
      }
    } catch (error) {
      console.warn(`LibreTranslate instance ${instance} failed:`, error)
      continue // Try next instance
    }
  }
  
  throw new Error('All LibreTranslate instances failed')
}

// Fallback to Google Translate (requires no API key, but may be rate limited)
async function translateWithGoogle(text: string, targetLang: string): Promise<string> {
  try {
    console.log('Trying Google Translate fallback')
    
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      signal: AbortSignal.timeout(8000) // 8 second timeout
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    
    // Google Translate API returns nested arrays
    if (data && data[0] && data[0][0] && data[0][0][0]) {
      const translatedText = data[0].map((item: any[]) => item[0]).join('')
      console.log('Google Translate successful')
      return translatedText
    } else {
      throw new Error('Invalid response format from Google Translate')
    }
  } catch (error) {
    console.warn('Google Translate failed:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, targetLang } = body

    // Validate input
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      )
    }

    if (!targetLang || typeof targetLang !== 'string') {
      return NextResponse.json(
        { error: 'Target language is required' },
        { status: 400 }
      )
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { error: 'Text is too long (max 5000 characters)' },
        { status: 400 }
      )
    }

    let translatedText: string
    let provider: string

    try {
      // Try LibreTranslate first
      translatedText = await translateWithLibreTranslate(text, targetLang)
      provider = 'LibreTranslate'
    } catch (libreError) {
      console.log('LibreTranslate failed, trying Google Translate:', libreError)
      
      try {
        // Fallback to Google Translate
        translatedText = await translateWithGoogle(text, targetLang)
        provider = 'Google Translate'
      } catch (googleError) {
        console.error('All translation services failed:', { libreError, googleError })
        
        return NextResponse.json(
          { 
            error: 'Translation services are currently unavailable. Please try again later.',
            details: 'Both LibreTranslate and Google Translate failed'
          },
          { status: 503 }
        )
      }
    }

    return NextResponse.json({
      translatedText,
      sourceText: text,
      targetLanguage: targetLang,
      provider
    })

  } catch (error) {
    console.error('Translation API error:', error)
    return NextResponse.json(
      { error: 'Translation service temporarily unavailable' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Translation API is running',
    supportedLanguages: [
      'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh',
      'ar', 'he', 'hi', 'th', 'vi', 'nl', 'sv', 'da', 'no', 'fi'
    ]
  })
}

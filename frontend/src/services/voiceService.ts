export class VoiceRecognitionService {
  private recognition: SpeechRecognition | null = null
  private isListening = false

  constructor() {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition()
      this.recognition.lang = 'zh-CN' // Chinese language
      this.recognition.continuous = false
      this.recognition.interimResults = false
      this.recognition.maxAlternatives = 1
    }
  }

  isSupported(): boolean {
    return this.recognition !== null
  }

  startListening(
    onResult: (transcript: string) => void,
    onError?: (error: Error) => void
  ): void {
    if (!this.recognition) {
      onError?.(new Error('语音识别不支持'))
      return
    }

    if (this.isListening) {
      return
    }

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      onResult(transcript)
      this.isListening = false
    }

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      onError?.(new Error(`语音识别错误: ${event.error}`))
      this.isListening = false
    }

    this.recognition.onend = () => {
      this.isListening = false
    }

    try {
      this.recognition.start()
      this.isListening = true
    } catch (error) {
      console.error('Failed to start speech recognition:', error)
      onError?.(error as Error)
      this.isListening = false
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  getIsListening(): boolean {
    return this.isListening
  }
}

export const voiceService = new VoiceRecognitionService()

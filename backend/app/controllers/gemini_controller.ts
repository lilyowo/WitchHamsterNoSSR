import env from '#start/env'
import { GoogleGenerativeAI } from '@google/generative-ai'

export default class GeminiController {
  async liuRen({ request, response }) {
    const { question, resultA, resultB, resultC, analysisText } = request.only([
      'question',
      'resultA',
      'resultB',
      'resultC',
      'analysisText',
    ])

    if (!resultA || !resultB || !resultC || !analysisText) {
      return response.badRequest({ error: 'missing fields' })
    }

    const prompt = `請你扮演一位女倉鼠法師,針對問題「${question ?? ''}」給予回答。
占卜結果是:【${resultA}】、【${resultB}】、【${resultC}】。
基本的判斷是:${analysisText}。
請給我 300 字以內的解析，只講重點，口吻要嚴肅禮貌並且犀利。以「倉鼠法師掐指一算，認為你問的這件事」為開頭`

    const apiKey = env.get('GEMINI_API_KEY')
    const modelName = env.get('GEMINI_MODEL', 'gemini-2.5-flash')

    try {
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: modelName })

      const result = await model.generateContent(prompt)
      const text = await result.response.text()

      return response.ok({ text })
    } catch (err) {
      // 不要把 apiKey 印出來
      console.error('[Gemini] error:', err?.message ?? err)
      return response.internalServerError({ error: 'gemini_failed' })
    }
  }
}

import { Component, ChangeDetectionStrategy, PLATFORM_ID, Inject, ChangeDetectorRef} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
// import { GoogleGenerativeAI, GenerateContentResult } from "@google/generative-ai";



@Component({
  selector: 'app-liu-ren',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './liu-ren.html',
  styleUrls: ['./liu-ren.css'],
  changeDetection: ChangeDetectionStrategy.Default // Corrected line
})
export class LiuRen {
  showModal: boolean = true;
  question: string = '';
  num1: number | null = null;
  num2: number | null = null;
  num3: number | null = null;

  resultA: string = '...';
  resultB: string = '...';
  resultC: string = '...';
  analysisText: string = '等待計算中...';
  
  analysisText2: string = '點擊下方按鈕獲取靈感...';
  isLoading: boolean = false;

  private readonly results = [
    '天德', '大安', '留連', '速喜', '赤口',
    '小吉', '空亡', '病符', '桃花'
  ];

  private readonly resultMeaning: Record<number, string> = {
    0: '受到天助，有貴人出現，事情容易得到幫助。在八卦中屬乾卦，五行屬金，方位西北。',
    1: '局勢穩定，適合按部就班進行，若求安穩則大吉，若球變化則不吉。在八卦中屬震卦，五行屬木，方位正東。',
    2: '事情容易拖延，需要多一點耐心，若想挽留延遲則大吉，否則皆不吉。在八卦中屬巽卦，五行屬木，方位西南。',
    3: '消息來得快，進展迅速，令人意想不到的好事或壞事。在八卦中屬離卦，五行屬火，方位正南。',
    4: '容易有口舌是非或衝突，導致吵架打架需要謹慎應對，連出兩個赤口要當心血光之災。在八卦中屬兌卦，五行屬金，方位正西。',
    5: '問事情成敗屬勉強吉格，成中有缺，若初始起步為吉。在八卦中屬坎卦，五行屬水，方位正北。',
    6: '事情可能落空，先得後失，忌金錢之事，宜虛幻之事如玄學、哲學、心理學等。在九宮中立中宮，五行屬土，方位正中。',
    7: '身心疲憊或狀態不佳，或指事情有病根有問題需醫治需處理。在八卦中屬坤卦，五行屬土，方位西南。',
    8: '與人際、感情、吸引力有關，若問人際關係桃花運勢則大吉，否則事件將有人事牽絆糾纏難處理不吉。在八卦中屬艮卦，五行屬土，方位東北。'
  };

  
  private model: any = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object , private cdr: ChangeDetectorRef) {
    if (isPlatformBrowser(this.platformId)) {
    }
  }
  calculate() {
    if (this.num1 === null || this.num2 === null || this.num3 === null) {
      alert('請輸入三個數字喔!');
      return;
    }
    const x = this.num1 % 9;
    const y = (this.num2 + x - 1) % 9;
    const z = (this.num3 + y - 1) % 9;

    this.resultA = this.results[x];
    this.resultB = this.results[y];
    this.resultC = this.results[z];

    const startText = this.resultMeaning[x];
    const processText = this.resultMeaning[y];
    const endText = this.resultMeaning[z];

    this.analysisText =
      `這件事情剛開始會${startText}\n` +
      `過程的情況會${processText}\n` +
      `最後結果會${endText}`;

    console.log('準備關閉彈窗');
    this.showModal = false;
    
    this.analysisText2 = '點擊「查看」按鈕,讓 AI 為您深入解惑...';
  }

  async getAIInterpretation() {
    if (this.resultA === '...') {
      alert('請先輸入數字進行初步計算!');
      return;
    }

    this.isLoading = true;
    this.analysisText2 = '倉鼠正在用短短的爪子認真掐指一算,請稍候...';

    try {
      // 後端位置：先用桌機 LAN IP
      const BACKEND_BASE = 'http://172.20.10.6:3333';
      console.log('🔮 開始呼叫 Gemini API...');
      const res = await fetch(`${BACKEND_BASE}/api/liu-ren/gemini`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: this.question,
          resultA: this.resultA,
          resultB: this.resultB,
          resultC: this.resultC,
          analysisText: this.analysisText,
        }),
      });

      const data = await res.json();
      console.log(data);
      this.analysisText2 = data;
      this.cdr.detectChanges();
      if (!res.ok) {
        throw new Error(data?.error || '後端回應失敗');
      }
      this.analysisText2 = data;
      this.cdr.detectChanges();
      this.isLoading = false;
      this.analysisText2 = data?.text ?? '(沒有取得文字)';
      this.cdr.detectChanges();
    } catch (e: any) {
    this.analysisText2 = `系統錯誤: ${e?.message || '未知錯誤'}`;
    this.isLoading = false;
    } finally {
    this.isLoading = false;
    }
  }
}

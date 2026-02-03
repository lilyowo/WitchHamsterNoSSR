import { Component, ChangeDetectionStrategy,  ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TarotService, TarotCard } from '../../service/tarot.service';
interface PickedTarot {
  id: number;
  isReversed: boolean;
}


@Component({
  selector: 'app-tarot',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tarot.html',
  styleUrl: './tarot.css',
  changeDetection: ChangeDetectionStrategy.Default
})
export class Tarot implements OnInit {
  constructor(private cdr: ChangeDetectorRef, private tarotService: TarotService) {
  }
  step: 'modal' | 'shuffle' | 'spread' | 'pick' | 'result' = 'modal';
  questionType: 'general' | 'love' | 'career' = 'general';

  question = '';

  deck: number[] = [];
  pickedCards: PickedTarot[] = [];

  // 顯示用
  resultA = '';
  resultB = '';
  resultC = '';

  contentA = '';
  contentB = '';
  contentC = '';

  

  ngOnInit() {
    // 載入 JSON
    this.tarotService.loadCards().subscribe(() => {
      // 初始化牌組 0~77
      this.deck = Array.from({ length: 78 }, (_, i) => i);
    });
  }

  startShuffle() {
    console.log('🃏 開始洗牌');
    this.step = 'shuffle';

    setTimeout(() => {
      this.deck = Array.from({ length: 78 }, (_, i) => i + 1);
      this.deck.sort(() => Math.random() - 0.5);

      console.log('✅ 洗牌完成，準備展開');

      // 👇 進入「展開牌」狀態
      this.step = 'spread';
      this.cdr.detectChanges();

      // 給展開動畫時間
      setTimeout(() => {
        console.log('🟢 可以開始抽牌');
        this.step = 'pick';
        this.cdr.detectChanges();
      }, 1200);

    }, 5000); // 改為 2000ms，讓洗牌動畫播放 2 秒
  }

  /** 抽牌（同時決定正逆位） */
  pickCard(cardId: number) {
    if (this.pickedCards.length >= 3) return;

    const isReversed = Math.random() < 0.5;

    this.pickedCards.push({
      id: cardId,
      isReversed
    });

    this.deck = this.deck.filter(id => id !== cardId);

    if (this.pickedCards.length === 3) {
      this.prepareResult();
      setTimeout(() => {
        this.step = 'result';
      }, 800);
    }
  }

  /** 組合解析文字 */
  prepareResult() {
    const [a, b, c] = this.pickedCards;

    this.resultA =
      this.tarotService.getCardName(a.id) + (a.isReversed ? '（逆位）' : '（正位）');

    this.resultB =
      this.tarotService.getCardName(b.id) + (b.isReversed ? '（逆位）' : '（正位）');

    this.resultC =
      this.tarotService.getCardName(c.id) + (c.isReversed ? '（逆位）' : '（正位）');


    this.contentA = this.tarotService.getCardMeaning(a.id, a.isReversed, this.questionType);
    this.contentB = this.tarotService.getCardMeaning(b.id, b.isReversed, this.questionType);
    this.contentC = this.tarotService.getCardMeaning(c.id, c.isReversed, this.questionType);
  }
  getCardTransform(i: number): string {
  const cardsPerRow = 26;
  const row = Math.floor(i / cardsPerRow);
  const col = i % cardsPerRow;

  const spread = 9;
  const baseX = -120;
  const angle = (col - cardsPerRow / 2) * 1.5;

  const x = col * spread + baseX;
  const y = row * 150;
  return `translate(${x}px, ${y}px) rotate(${angle}deg)`;
}


  /** 給 HTML 用 */
  getCardImage(card: PickedTarot): string {
    return this.tarotService.getCardImage(card.id);
  }

  analysisText2: string = '';
  isLoading: boolean = false;
  async getTarotAIInterpretation() {
  if (this.isLoading) return;

  this.isLoading = true;
  this.analysisText2 = '';

  try {
    const BACKEND_BASE = 'https://api.hamster-witch.org';
    const res = await fetch(`${BACKEND_BASE}/api/tarot/gemini`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: this.question,
        resultA: this.resultA,
        resultB: this.resultB,
        resultC: this.resultC,
        questionType: this.questionType,
        analysisText: `
    ${this.resultA} 通常代表 ${this.contentA}
    ${this.resultB} 通常代表 ${this.contentB}
    ${this.resultC} 通常代表 ${this.contentC}
            `.trim(),
          }),
        });

        if (!res.ok) {
          throw new Error('API failed');
        }

        const data = await res.json();
        this.analysisText2 = data.text ?? '';
        this.isLoading = false;
        this.cdr.detectChanges();
      } catch (err) {
        console.error('[Lenormand AI] error:', err);
        this.analysisText2 = '倉鼠法師現在有點累，請稍後再試。';
        this.isLoading = false;
        this.cdr.detectChanges();
      } finally {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    }
}

import { Component, ChangeDetectionStrategy,  ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-lenormand',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './lenormand.html',
  styleUrls: ['./lenormand.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class Lenormand{
  constructor(private cdr: ChangeDetectorRef) {
  }
  step: 'modal' | 'shuffle' | 'spread' | 'pick' | 'result' = 'modal';


  question = '';

  deck: number[] = [];
  pickedCards: number[] = [];

  /** 開始抽牌 */
  startShuffle() {
    if (!this.question.trim()) return;

    console.log('🃏 開始洗牌');
    this.step = 'shuffle';

    setTimeout(() => {
      this.deck = Array.from({ length: 40 }, (_, i) => i + 1);
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



  isPicking = false;

  pickCard(card: number) {
    // ❌ 已完成或正在收尾，全部忽略
    if (this.isPicking) return;
    if (this.pickedCards.length >= 3) return;

    this.pickedCards.push(card);
    this.deck = this.deck.filter(c => c !== card);

    // 🎯 第三張就是完成
    if (this.pickedCards.length === 3) {
      this.isPicking = true; // 鎖住所有點擊

      console.log('🎴 三張已抽完');

      // 如果你想要一點點視覺緩衝，可以留 300ms
      setTimeout(() => {
        this.step = 'result';
        this.isPicking = false;
      }, 300);
    }
  }

  // 1～40 對應的牌名（index = 牌號 - 1）
  cardNames: string[] = [
    '騎士', '幸運草', '船', '房子', '樹',
    '雲', '蛇', '棺材', '花束', '鐮刀',
    '鞭子', '鳥', '孩子', '狐狸', '熊',
    '星星', '鸛', '狗', '塔', '花園',
    '山', '道路', '老鼠', '心', '戒指',
    '書', '信', '男人', '女人', '百合',
    '太陽', '月亮', '鑰匙', '魚', '錨',
    '十字架', '靈體', '香爐', '床', '市場'
  ];

  // 1～40 對應的代表詞
  cardMeanings: string[] = [
  // 1 騎士
  '快速到來、主動推進、正在發生的',
  // 2 幸運草
  '短暫的好運、輕鬆的小確幸、機會稍縱即逝的',
  // 3 船
  '遠行、距離、改變方向或跨越現況的',
  // 4 房子
  '穩定、安全感、家庭或既有基礎相關的',
  // 5 樹
  '長期發展、成長緩慢但根基深厚的',
  // 6 雲
  '混亂、不確定、資訊被遮蔽的',
  // 7 蛇
  '複雜的、人際糾葛、需要小心算計的',
  // 8 棺材
  '結束、告一段落、必要的轉換',
  // 9 花束
  '喜悅、祝福、被肯定或受到欣賞的',
  // 10 鐮刀
  '突發事件、割捨、需要立即做出決斷的',
  // 11 鞭子
  '反覆發生的衝突、壓力、內在拉扯',
  // 12 鳥
  '溝通、討論、短暫但頻繁的交流',
  // 13 孩子
  '新的開始、單純的心態、初期階段的',
  // 14 狐狸
  '需要提防的、自利的、不完全坦誠的',
  // 15 熊
  '力量、資源、掌控慾或保護性的',
  // 16 星星
  '希望、願景、清晰方向與信念',
  // 17 鸛
  '變化、轉換狀態、逐步改善的',
  // 18 狗
  '忠誠、可靠、值得信任的夥伴關係',
  // 19 塔
  '距離、制度、權威或情感上的隔閡',
  // 20 花園
  '公開場合、社交圈、群體互動',
  // 21 山
  '阻礙、困難、進展受限的',
  // 22 道路
  '選擇、分岔點、多種可能性並存的',
  // 23 老鼠
  '消耗、損失、慢慢被侵蝕的',
  // 24 心
  '情感、愛意、真心投入的',
  // 25 戒指
  '承諾、關係、契約或長期約定',
  // 26 書
  '隱藏的資訊、尚未揭露的真相',
  // 27 信
  '訊息、文件、通知或正式聯繫',
  // 28 男人
  '男性能量、主動方、行動導向的人',
  // 29 女人
  '女性能量、接收方、情感導向的人',
  // 30 百合
  '成熟、長期穩定、平靜與和諧',
  // 31 太陽
  '成功、正向能量、清楚明朗的結果',
  // 32 月亮
  '情緒、感受、潛意識與內心狀態',
  // 33 鑰匙
  '關鍵、解答、事情的突破口',
  // 34 魚
  '金錢、資源流動、價值交換',
  // 35 錨
  '停滯、固定狀態、長期承擔的責任',
  // 36 十字架
  '壓力、考驗、命運性課題',

  // 37–40（你擴充用的牌）
  // 37
  '精神層面、信念、指引或更高視角',
  // 38
  '淨化、釋放、去除多餘負擔',
  // 39
  '休息、舒適感、親密與身體層面的滿足',
  // 40
  '工作、交易、實際行動與現實層面的付出'
];

    get resultA() {
    return this.cardNames[this.pickedCards[0] - 1];
  }
  get resultB() {
    return this.cardNames[this.pickedCards[1] - 1];
  }
  get resultC() {
    return this.cardNames[this.pickedCards[2] - 1];
  }

  get contentA() {
    return this.cardMeanings[this.pickedCards[0] - 1];
  }
  get contentB() {
    return this.cardMeanings[this.pickedCards[1] - 1];
  }
  get contentC() {
    return this.cardMeanings[this.pickedCards[2] - 1];
  }
  analysisText2: string = '';
  isLoading: boolean = false;
  async getLenormandAIInterpretation() {
  if (this.isLoading) return;

  this.isLoading = true;
  this.analysisText2 = '';

  try {
    const BACKEND_BASE = 'https://api.hamster-witch.org';
    const res = await fetch(`${BACKEND_BASE}/api/lenormand/gemini`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: this.question,
        resultA: this.resultA,
        resultB: this.resultB,
        resultC: this.resultC,
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
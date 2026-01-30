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
    '快速到來、行動力強的',
    '運氣不錯的、小確幸的',
    '移動、遠行或變動中的',
    '穩定、安全、與家庭相關的',
    '成長緩慢但穩定的',
    '不明朗、混亂的',
    '複雜、有算計的',
    '結束、轉換階段的',
    '喜悅、祝福的',
    '突然發生、需要取捨的',
    '反覆、爭執或壓力的',
    '溝通、消息頻繁的',
    '新的、單純的',
    '需要提防的、不單純的',
    '有力量、掌控慾強的',
    '充滿希望與方向感的',
    '改變、轉變中的',
    '忠誠、可靠的',
    '制度、距離或界線感強的',
    '公開、社交層面的',
    '阻礙、難以跨越的',
    '選擇、分岔路的',
    '消耗、流失的',
    '情感、愛的',
    '承諾、關係的',
    '隱藏、尚未揭露的',
    '訊息、文件或聯繫的',
    '男性能量、主動方',
    '女性能量、被動方',
    '成熟、長期穩定的',
    '成功、正向能量的',
    '情緒、潛意識的',
    '關鍵、答案的',
    '金錢、資源流動的',
    '停滯或長期狀態的',
    '壓力、命運考驗的',
    '精神、指導靈方面的', '淨化', '休息、舒適、性愛', '工作、交易'
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


}
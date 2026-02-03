import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface TarotCard {
  id: number;
  name: string;
  upright: {
    general: string;
    love: string;
    career: string;
  };
  reversed: {
    general: string;
    love: string;
    career: string;
  };
  imgURL: string;
}

@Injectable({
  providedIn: 'root'
})
export class TarotService {
  private tarotUrl = '/tarot/tarot_cards.json'; // public/tarot/tarot.json

  private cards: TarotCard[] = [];

  constructor(private http: HttpClient) {}

  /** 載入全部塔羅牌（只做一次） */
  loadCards(): Observable<TarotCard[]> {
    return this.http.get<TarotCard[]>(this.tarotUrl).pipe(
      map(cards => {
        this.cards = cards;
        return cards;
      })
    );
  }

  /** 用 id 取得牌 */
  getCardById(id: number): TarotCard | undefined {
    return this.cards.find(c => c.id === id);
  }

  /** 取得牌名 */
  getCardName(id: number): string {
    return this.getCardById(id)?.name ?? '';
  }

  /** 取得牌意（依正逆） */
  getCardMeaning(
    id: number,
    isReversed: boolean,
    type: 'general' | 'love' | 'career' = 'general'
  ): string {
    const card = this.getCardById(id);
    if (!card) return '';
    return isReversed ? card.reversed[type] : card.upright[type];
  }

  /** 取得圖片 URL */
  getCardImage(id: number): string {
    return this.getCardById(id)?.imgURL ?? '';
  }
}

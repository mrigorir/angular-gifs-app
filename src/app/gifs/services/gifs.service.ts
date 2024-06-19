import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchResponse, Gif } from '../interfaces/gifs.interfaces';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  gifList: Gif[] = [];
  private apiKey: string = environment.siteKey;
  private baseUrl: string = environment.api;
  private _tagHistory: string[] = [];

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
  }

  get tagHistory() {
    return [...this._tagHistory];
  }

  searchTag(tag: string): void {
    if (tag.length === 0) return;
    this.organizeHistory(tag);
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', tag);
    this.http
      .get<SearchResponse>(`${this.baseUrl}/search`, { params })
      .subscribe((res) => {
        this.gifList = res.data;
      });

    this.saveLocalStorage();
  }

  private organizeHistory(tag: string): void {
    tag = tag.toLowerCase();
    if (this._tagHistory.indexOf(tag) !== -1) {
      this._tagHistory = this._tagHistory.filter(
        (currentTags) => currentTags !== tag
      );
    }
    this._tagHistory.unshift(tag);
    this.tagHistorySize();
  }

  private tagHistorySize(): string[] {
    return (this._tagHistory = this._tagHistory.splice(0, 10));
  }

  private saveLocalStorage(): void {
    localStorage.setItem('historyTags', JSON.stringify(this._tagHistory));
  }

  private loadLocalStorage(): void {
    if (localStorage.getItem('historyTags')){
      this._tagHistory = JSON.parse(localStorage.getItem('historyTags')!);
    }
    if (this._tagHistory.length > 0) {
      this.searchTag(this._tagHistory[0]);
    }
  }
}

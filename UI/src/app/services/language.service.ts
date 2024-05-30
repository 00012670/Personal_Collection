import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'ru']);
    const saveLang = localStorage.getItem('lang');
    if (saveLang) {
      translate.setDefaultLang(saveLang);
      translate.use(saveLang);
    } else {
      translate.setDefaultLang('en');
    }
  }

  switchLang(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }

  getLanguages() {
    return this.translate.getLangs();
  }

  getCurrentLanguage() {
    return this.translate.currentLang;
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkMode = false;
  private darkModeSubject = new BehaviorSubject(this.darkMode);

  constructor() {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      this.darkMode = JSON.parse(savedTheme);
    }
    this.darkModeSubject = new BehaviorSubject(this.darkMode);
    this.applyTheme();
  }

  isDarkMode() {
    return this.darkModeSubject.asObservable();
  }

  setDarkMode(isDarkMode: boolean) {
    this.darkMode = isDarkMode;
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    this.applyTheme();
    this.darkModeSubject.next(this.darkMode);
  }

  private applyTheme() {
    if (this.darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}

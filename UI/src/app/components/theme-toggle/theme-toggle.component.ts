import { Component } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.css']
})
export class ThemeToggleComponent {

  isDarkMode!: boolean;
  isSidebarShrinked = false;
  isEnglish!: boolean;

  constructor(
    private themeService: ThemeService,
    private languageService: LanguageService
  ) { }

  ngOnInit() {
    this.themeService.isDarkMode().subscribe((isDarkMode: boolean) => {
      this.isDarkMode = isDarkMode;
    });
    this.isEnglish = this.languageService.getCurrentLanguage() === 'en';
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkMode(this.isDarkMode);
  }

  toggleLanguage() {
    const newLang = this.isEnglish ? 'ru' : 'en';
    this.languageService.switchLang(newLang);
    this.isEnglish = this.languageService.getCurrentLanguage() === 'en';
  }
}

import { Component, OnInit } from '@angular/core';
import { JiraService } from 'src/app/services/jira.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UserIdentityService } from 'src/app/services/user-identity.service';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit {
  issues: any[] = [];
  isDarkMode!: boolean;

  constructor(
    private jiraService: JiraService,
    private userIdentity: UserIdentityService,
    private themeService: ThemeService,
  ) { }

  ngOnInit(): void {
    this.subscribeToThemeChanges();
    this.fetchIssues();
  }

  subscribeToThemeChanges(): void {
    this.themeService.isDarkMode().subscribe((isDarkMode: boolean) => {
      this.isDarkMode = isDarkMode;
    });
  }

  fetchIssues(): void {
    const email = this.userIdentity.currentUser.value.email;
    this.jiraService.getIssuesByReporterEmail(email).subscribe(
      data => this.handleIssueResponse(data),
      error => console.error(error)
    );
  }

  handleIssueResponse(data: any): void {
    this.issues = data.issues.map((issue: { key: any; }) => ({
      ...issue,
      ticketLink: `https://kazimovadinora.atlassian.net/browse/${issue.key}`
    }));
  }
}

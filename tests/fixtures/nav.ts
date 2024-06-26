import { expect, type Locator, type Page, type ViewportSize } from "@playwright/test";
import type { Context } from "@prisma/client";

interface IQuickActions {
    container: Locator;
    newProject: Locator;
    newTask: Locator;
}

export class NavFixture {
    public isMobile: boolean;

    public menuButton: Locator;
    public menuButtonIcon: Locator;

    public nav: Locator;

    public dashboardLink: Locator;
    public settingsLink: Locator;
    public userAvatar: Locator;
    public userEmail: Locator;

    public desktopQuickActions: IQuickActions;

    public contextLinks: {
        inbox: Locator;
        projects: Locator;
        waitingFor: Locator;
        atHome: Locator;
        atWork: Locator;
        atComputer: Locator;
        anywhere: Locator;
        phoneCalls: Locator;
    };

    public signoutButton: Locator;

    public copyright: Locator;

    constructor(public readonly page: Page, public readonly viewport?: ViewportSize | null) {
        this.isMobile = !!viewport && viewport.width < 768;

        if (this.isMobile) {
            this.nav = this.page.getByTestId('mobile-global-nav');
        } else {
            this.nav = this.page.getByTestId('desktop-nav-container');
        }

        this.menuButton = this.page.getByTestId('mobile-global-nav-trigger');
        this.menuButtonIcon = this.menuButton.getByTestId('mobile-global-nav-trigger-icon');

        this.dashboardLink = this.nav.getByRole('link', { name: 'Dashboard' });
        this.settingsLink = this.nav.getByTestId('settings-link');
        this.userAvatar = this.settingsLink.getByTestId('user-avatar');
        this.userEmail = this.settingsLink.getByTestId('user-email');

        this.desktopQuickActions = {
            container: this.nav.getByTestId('quick-actions'),
            newProject: this.nav.getByTestId('quick-actions').getByTestId('new-quick-project-button'),
            newTask: this.nav.getByTestId('quick-actions').getByTestId('new-quick-task-button'),
        };

        this.contextLinks = {
            inbox: this.nav.getByRole('link', { name: 'Inbox' }),
            projects: this.nav.getByRole('link', { name: 'Projects' }),
            waitingFor: this.nav.getByRole('link', { name: 'Waiting For' }),
            atHome: this.nav.getByRole('link', { name: 'At Home' }),
            atWork: this.nav.getByRole('link', { name: 'At Work' }),
            atComputer: this.nav.getByRole('link', { name: 'At Computer' }),
            anywhere: this.nav.getByRole('link', { name: 'Anywhere' }),
            phoneCalls: this.nav.getByRole('link', { name: 'Phone Calls' }),
        };

        this.signoutButton = this.nav.getByTestId('signout-button');

        this.copyright = this.nav.getByText(`Copyright ${new Date().getFullYear()}`);
    }

    public openMobileNav = async (): Promise<void> => {
        if (!this.isMobile) return;
        
        await this.menuButton?.click({ force: true });

        // await this.page.waitForTimeout(250);
    }

    public assertCustomContextDoesNotExist = async (ctx: Context) => {
        await this.openMobileNav();
        const context = this.nav.getByRole('link', { name: ctx.name });
        await expect(context).not.toBeVisible();
    }

    public assertCustomContextExists = async (ctx: Context) => {
        await this.openMobileNav();
        const context = this.nav.getByRole('link', { name: ctx.name });
        await expect(context).toBeVisible();
    }
}
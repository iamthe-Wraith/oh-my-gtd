import type { Locator, Page, ViewportSize } from "@playwright/test";
import { NavFixture } from "./nav";

interface IQuickActions {
    container: Locator;
    newProject: Locator;
    newTask: Locator;
}

interface IQuickActionElements {
    modal: Locator;
    modalClose: Locator;
    form: Locator;
    title: Locator;
    description: Locator;
    titleError: Locator;
    descriptionError: Locator;
    genError: Locator;
    cancelButton: Locator;
    createButton: Locator;
}

export class QuickActionsFixture {
    public isMobile: boolean;

    public nav: NavFixture;

    public desktopQuickActions: IQuickActions;
    public mobileQuickActions: IQuickActions;

    public task: IQuickActionElements;
    public project: IQuickActionElements;

    constructor(public readonly page: Page, public readonly viewport?: ViewportSize | null) {
        this.isMobile = !!viewport && viewport.width < 768;

        this.nav = new NavFixture(page, viewport);

        this.desktopQuickActions = this.nav.desktopQuickActions;

        this.mobileQuickActions = {
            container: this.page.getByTestId('mobile-quick-actions'),
            newProject: this.page.getByTestId('mobile-quick-actions').getByTestId('new-quick-project-button'),
            newTask: this.page.getByTestId('mobile-quick-actions').getByTestId('new-quick-task-button'),
        };

        this.task = {} as IQuickActionElements;
        this.project = {} as IQuickActionElements;

        if (this.isMobile) {
            this.task.modal = this.mobileQuickActions.container.getByTestId('new-quick-task-modal');
            this.project.modal = this.mobileQuickActions.container.getByTestId('new-quick-project-modal');
        } else {
            this.task.modal = this.desktopQuickActions.container.getByTestId('new-quick-task-modal');
            this.project.modal = this.desktopQuickActions.container.getByTestId('new-quick-project-modal');
        }
        
        this.task.modalClose = this.task.modal.getByTestId('close-modal-button');
        this.project.modalClose = this.project.modal.getByTestId('close-modal-button');

        this.task.form = this.task.modal.getByTestId('new-quick-task-form');
        this.project.form = this.project.modal.getByTestId('new-quick-project-form');

        this.task.title = this.task.form.getByTestId('new-quick-task-title');
        this.task.description = this.task.form.getByTestId('new-quick-task-description');
        this.project.title = this.project.form.getByTestId('new-quick-project-title');
        this.project.description = this.project.form.getByTestId('new-quick-project-description');

        this.task.titleError = this.task.form.getByTestId('title-error');
        this.task.descriptionError = this.task.form.getByTestId('description-error');
        this.task.genError = this.task.form.getByTestId('new-quick-task-gen-error');
        this.project.titleError = this.project.form.getByTestId('title-error');
        this.project.descriptionError = this.project.form.getByTestId('description-error');
        this.project.genError = this.project.form.getByTestId('new-quick-project-gen-error');

        this.task.cancelButton = this.task.form.getByTestId('new-quick-task-cancel');
        this.task.createButton = this.task.form.getByTestId('new-quick-task-create');
        this.project.cancelButton = this.project.form.getByTestId('new-quick-project-cancel');
        this.project.createButton = this.project.form.getByTestId('new-quick-project-create');
    }

    public async openProjectModal() {
        if (this.isMobile) {
            await this.mobileQuickActions.newProject.click();
        } else {
            await this.desktopQuickActions.newProject.click();
        }
    }

    public async openTaskModal() {
        if (this.isMobile) {
            await this.mobileQuickActions.newTask.click();
        } else {
            await this.desktopQuickActions.newTask.click();
        }
    }
}
import { Component, ViewEncapsulation } from '@angular/core';
import { UserGuideItem } from '@app/classes/interfaces/user-guide';

const MAX_OPACITY = 1;

@Component({
    selector: 'app-user-manual',
    templateUrl: './user-manual.component.html',
    styleUrls: ['./user-manual.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class UserManualComponent {
    userGuide: UserGuideItem;
    finalOpacity: number;
    isEmptyInitially: boolean;

    constructor() {
        this.initialiseGuide();
    }

    onScroll(): void {
        const sectionOffsetY = document.getElementsByClassName('section-body')[0].scrollTop;
        const descriptionHeight = document.getElementsByClassName('section-description')[0].clientHeight;
        const offset = 40;
        const maxOffset = descriptionHeight - offset;

        this.finalOpacity = MAX_OPACITY - sectionOffsetY / maxOffset;
    }

    setDrawingNode(node: UserGuideItem): void {
        this.updateGuide(node);
    }

    setDiverseNode(node: UserGuideItem): void {
        this.updateGuide(node);
    }

    updateGuide(node: UserGuideItem): void {
        const sectionContainer = document.getElementsByClassName('section-body')[0];

        this.isEmptyInitially = false;
        this.userGuide = node;
        this.finalOpacity = MAX_OPACITY;
        sectionContainer.scrollTop = 0;
    }

    initialiseGuide(index?: number): void {
        let currentSection;
        this.finalOpacity = MAX_OPACITY;
        this.isEmptyInitially = true;

        if (index === 0 || !index) {
            currentSection = 'Divers';
        } else {
            currentSection = 'Dessiner';
        }

        this.userGuide = {
            title: 'Bienvenue',
            number: '0',
            sections: [
                {
                    description: `Veuillez choisir un sujet concernant <span class="current-section-name">${currentSection}</span>`,
                },
            ],
        };
    }
}

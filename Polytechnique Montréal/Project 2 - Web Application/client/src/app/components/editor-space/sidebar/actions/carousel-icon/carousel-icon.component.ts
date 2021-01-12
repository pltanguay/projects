import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarouselComponent } from '@app/components/carousel/carousel.component';
import { Keyboard } from '@app/declarations/keyboard.enum';
import { Shortcut } from '@app/services/shortcut-handler/shortcut';
import { ShortcutHandlerService } from '@app/services/shortcut-handler/shortcut-handler.service';

@Component({
    selector: 'app-carousel-icon',
    templateUrl: './carousel-icon.component.html',
    styleUrls: ['./carousel-icon.component.scss'],
})
export class CarouselIconComponent implements OnInit {
    @Input() isSelected: boolean;

    toolTipText: string = 'Carousel - CTRL + G';

    constructor(public carouselDialog: MatDialog, private shortcutHandler: ShortcutHandlerService) {}

    ngOnInit(): void {
        this.shortcutHandler.register(new Shortcut(Keyboard.G, true), this.shortcutCarouselAction.bind(this));
    }

    onClickAction(): void {
        this.carouselDialog.open(CarouselComponent, {
            panelClass: 'carousel',
        });
    }

    shortcutCarouselAction(): void {
        if (this.carouselDialog.openDialogs.length > 0) return;
        this.onClickAction();
    }
}

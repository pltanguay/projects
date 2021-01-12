import { Injectable } from '@angular/core';
import { CircularBuffer } from '@app/classes/utils/ring-buffer';
import { CarouselService } from '@app/services/carousel/carousel.service';
import { DrawingData } from '@common/communication/drawing-data';

@Injectable({
    providedIn: 'root',
})
export class FilterService {
    unfilteredImages: CircularBuffer<DrawingData>;
    private tagFilter: string;
    filters: string[];

    applyFilterFunc: (drawing: DrawingData) => boolean = (drawing: DrawingData) => this.containsCurrentTag(drawing);
    unapplyFilterFunc: (drawing: DrawingData) => boolean = (drawing: DrawingData) => !this.containsCurrentTag(drawing);

    constructor(private carouselService: CarouselService) {
        this.unfilteredImages = new CircularBuffer();
        this.filters = [];
    }

    applyFilter(filter: string): void {
        this.tagFilter = filter;
        if (this.filters.length === 0) {
            this.applyFilterFirstTime();
            return;
        }

        const valuesToAdd = this.unfilteredImages.filter(this.unapplyFilterFunc);
        this.carouselService.drawings.add(valuesToAdd);
        this.filters.push(filter);
    }

    unapplyFilter(index: number): void {
        this.tagFilter = this.filters[index];
        this.filters.splice(index, 1);
        if (this.filters.length === 0) {
            this.restore();
            return;
        }
        const omittedValues = this.carouselService.drawings.filter((drawing: DrawingData) => {
            return !this.canBeUnfiltered(drawing);
        });
        if (omittedValues.length === 0) return;
        this.unfilteredImages.add(omittedValues);
    }

    tryUpdateFilters(clickedDrawing: DrawingData): void {
        for (const tag of clickedDrawing.tags) {
            if (!this.isInFilterTags(tag)) continue;

            if (!this.canRemoveTag(tag)) continue;

            this.removeTagFromFilter(tag);
        }
    }

    restore(): void {
        this.carouselService.drawings.add(this.unfilteredImages.buffer);
        this.unfilteredImages.reset();
        this.filters = [];
    }

    reset(): void {
        this.unfilteredImages.reset();
        this.filters = [];
    }

    private canBeUnfiltered(drawing: DrawingData): boolean {
        if (!this.containsCurrentTag(drawing)) return false;

        for (const tag of drawing.tags) {
            if (!this.isInFilterTags(tag)) continue;
            return false;
        }

        return true;
    }

    private applyFilterFirstTime(): void {
        const size = this.carouselService.drawingsLength;
        const omittedValues = this.carouselService.drawings.filter(this.applyFilterFunc);
        if (omittedValues.length !== size) this.filters.push(this.tagFilter);
        this.unfilteredImages.add(omittedValues);
    }

    private canRemoveTag(tag: string): boolean {
        this.tagFilter = tag;
        for (const drawing of this.carouselService.drawings.buffer) {
            if (this.containsCurrentTag(drawing)) {
                return false;
            }
        }
        return true;
    }

    private removeTagFromFilter(tag: string): void {
        const index = this.filters.indexOf(tag);
        this.filters.splice(index, 1);
    }

    private isInFilterTags(tag: string): boolean {
        for (const tagFilter of this.filters) {
            if (tag === tagFilter) {
                return true;
            }
        }
        return false;
    }

    private containsCurrentTag(drawing: DrawingData): boolean {
        for (const tag of drawing.tags) {
            if (tag === this.tagFilter) {
                return true;
            }
        }
        return false;
    }
}

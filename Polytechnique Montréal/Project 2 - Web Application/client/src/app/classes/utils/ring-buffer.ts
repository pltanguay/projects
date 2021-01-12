export class CircularBuffer<T> {
    buffer: T[] = [];
    private pos: number = 0;

    add(items: T[]): void {
        items.forEach((item) => {
            this.buffer.unshift(item);
        });
    }

    restore(items: T[]): T[] {
        const values = this.buffer;
        this.buffer = items;
        return values;
    }

    reset(): void {
        this.buffer = [];
    }

    deq(): T | undefined {
        return this.buffer.pop();
    }

    get(index: number): T {
        let currentIndex: number = index + this.pos;
        if (currentIndex < 0) {
            currentIndex += this.buffer.length;
        }

        return this.buffer[currentIndex % this.size];
    }

    filter(verification: (element: T) => boolean): T[] {
        const omittedValues: T[] = [];
        this.buffer = this.buffer.filter((element: T) => {
            if (verification(element)) {
                return true;
            }
            omittedValues.push(element);
            return false;
        });
        if (!this.buffer) this.buffer = [];
        return omittedValues;
    }

    next(): void {
        this.pos = (this.pos + 1) % this.size;
    }

    previous(): void {
        this.pos = (this.pos - 1) % this.size;
    }

    get size(): number {
        return this.buffer.length;
    }
}

export class Queue<T> {
    items: T[] = [];

    push(val: T): void {
        this.items.push(val);
    }
    pop(): T | undefined {
        return this.items.shift();
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }
}

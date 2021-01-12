export class Path<T> {
    private points: T[];

    constructor(points: T[] = []) {
        this.points = points;
    }

    add(point: T): void {
        this.points.push(point);
    }

    removeLast(): T | undefined {
        return this.points.pop();
    }

    getFirst(): T {
        return this.points[0];
    }

    getLastPoints(count: number): T[] {
        if (this.points.length < count) return this.points;
        return this.points.slice(this.points.length - count, this.points.length);
    }

    getLast(): T {
        return this.points[this.points.length - 1];
    }

    isEmpty(): boolean {
        return this.points.length === 0;
    }

    get length(): number {
        return this.points.length;
    }

    clear(): void {
        this.points = [];
    }

    forEach(cb: (value: T) => void): void {
        this.points.forEach(cb);
    }
}

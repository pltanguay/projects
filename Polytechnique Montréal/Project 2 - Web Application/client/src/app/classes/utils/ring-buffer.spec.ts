import { TestBed } from '@angular/core/testing';
import { CircularBuffer } from './ring-buffer';
// tslint:disable:no-string-literal
// tslint:disable:no-magic-numbers
// tslint:disable:no-any

describe('Color', () => {
    const numbers: number[] = [1, 2, 3, 4];
    let buffer: CircularBuffer<number>;

    beforeEach(() => {
        buffer = new CircularBuffer();
        buffer.add(numbers);

        TestBed.configureTestingModule({
            providers: [{ provide: CircularBuffer }],
        });
    });

    it('should be created', () => {
        expect(buffer).toBeTruthy();
    });

    it('#add should insert items in #CircularBuffer', () => {
        // Arrange
        const newNumbers: number[] = [5, 6, 7];
        const newBuffer: CircularBuffer<number> = new CircularBuffer();

        // Act
        newBuffer.add(newNumbers);

        // Assert
        expect(newBuffer.size).toBe(3);
    });

    it('#restore should replace items in #CircularBuffer', () => {
        // Arrange
        const newNumbers: number[] = [5, 6, 7, 2, 1];
        const newBuffer: CircularBuffer<number> = new CircularBuffer();
        newBuffer.add(newNumbers);

        // Act
        buffer.restore(newNumbers);

        // Assert
        expect(buffer.size).toBe(5);
    });

    it('#deq should return last item in #CircularBuffer', () => {
        // Arrange

        // Act
        const lastElement = buffer.deq();

        // Assert
        expect(lastElement).toBe(1);
    });

    it('#get should return wanted item at specific index from #CircularBuffer', () => {
        // Arrange
        buffer['pos'] = 2;

        // Act
        const element = buffer.get(1);

        // Assert
        expect(element).toBe(1);
    });

    it('#next should increment #pos of #CircularBuffer', () => {
        // Arrange
        buffer['pos'] = 4;

        // Act
        buffer.next();

        // Assert
        expect(buffer['pos']).toBe(1); // 5 % 4 = 1
    });

    it('#previous should decrement #pos of #CircularBuffer', () => {
        // Arrange
        buffer['pos'] = 4;

        // Act
        buffer.previous();

        // Assert
        expect(buffer['pos']).toBe(3); // 3 % 4 = 3
    });

    it('#filter should reset buffer to null if the filter is incomplete', () => {
        // Arrange
        const callback = (n: number) => {
            return !numbers.includes(n);
        };
        spyOn(buffer.buffer, 'filter').and.returnValue(null as any);

        // Act
        buffer.filter(callback);

        // Assert
        expect(buffer.size).toBe(0);
    });
});

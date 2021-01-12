import { Vec2 } from '@app/classes/interfaces/vec2';
import { Line, MAXIMUM_DISTANCE_LOOP } from '@app/classes/line/line';
import { canvasTestHelper } from '@app/classes/utils/canvas-test-helper';
describe('Line', () => {
    let line: Line;
    let width: number;
    let withJunctions: boolean;
    let radius: number;
    let color: string;
    let point: Vec2;
    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        spyOn(ctxStub, 'stroke');
        spyOn(ctxStub, 'fill');
        spyOn(ctxStub, 'lineTo');

        point = { x: 0, y: 0 };

        width = 0;
        withJunctions = false;
        radius = 0;
        color = 'black';
        line = new Line(width, withJunctions, radius, color);
    });

    it('should be created', () => {
        // Arrange

        // Act

        // Assert
        expect(line).toBeTruthy();
    });

    it('draw should not draw on canvas when no points are added', () => {
        // Arrange

        // Act
        line.draw(ctxStub);

        // Assert
        expect(ctxStub.lineTo).not.toHaveBeenCalled();
    });

    it('draw should draw on canvas when a point is added', () => {
        // Arrange
        line.addSegment(point);
        const expectedPath = new Path2D();
        expectedPath.lineTo(point.x, point.y);

        // Act
        line.draw(ctxStub);

        // Assert
        expect(ctxStub.stroke).toHaveBeenCalledWith(expectedPath);
    });

    it('draw Preview should draw on canvas when a point is added with vertex', () => {
        // Arrange
        line.addSegment(point);
        line.addPreviewSegment(point);
        const expectedPath = new Path2D();
        expectedPath.lineTo(point.x, point.y);
        expectedPath.lineTo(point.x, point.y);

        // Act
        line.drawPreview(ctxStub);

        // Assert
        expect(ctxStub.stroke).toHaveBeenCalledWith(expectedPath);
    });

    it('drawBase should not draw preview segment', () => {
        // Arrange
        line.addSegment(point);
        line.addPreviewSegment(point);
        const expectedPath = new Path2D();
        expectedPath.lineTo(point.x, point.y);

        // Act
        line.draw(ctxStub);

        // Assert
        expect(ctxStub.stroke).toHaveBeenCalledWith(expectedPath);
    });

    it('draw should draw a junction on canvas when withJunctions is true', () => {
        // Arrange
        withJunctions = true;
        line = new Line(width, withJunctions, radius, color);

        const expectedPath = new Path2D();
        expectedPath.lineTo(point.x, point.y);

        line.addSegment(point);

        // Act
        line.draw(ctxStub);

        // Assert
        expect(ctxStub.stroke).toHaveBeenCalledWith(expectedPath);
        expect(ctxStub.fill).toHaveBeenCalled();
    });

    it('removeLastVertex should remove segment', () => {
        // Arrange
        const expectedPath = new Path2D();
        expectedPath.lineTo(point.x, point.y);

        line.addSegment(point);
        line.addSegment(point);

        // Act
        line.removeLastVertex();
        line.draw(ctxStub);

        // Assert
        expect(ctxStub.stroke).toHaveBeenCalledWith(expectedPath);
    });

    it('removeLastVertex should not remove vertex when there is just one', () => {
        // Arrange
        const expectedPath = new Path2D();
        expectedPath.lineTo(point.x, point.y);

        line.addSegment(point);

        // Act
        line.removeLastVertex();
        line.draw(ctxStub);

        // Assert
        expect(ctxStub.stroke).toHaveBeenCalledWith(expectedPath);
    });

    it('getLastVertex should return last vertex', () => {
        // Arrange
        line.addSegment(point);

        // Act
        const pointResult = line.getLastVertex();

        // Assert
        expect(pointResult).toBe(point);
    });

    it('isStarted should return false when no points are added', () => {
        // Arrange

        // Act
        const result = line.isStarted();

        // Assert
        expect(result).toBe(false);
    });

    it('isStarted should return turn when points are added', () => {
        // Arrange
        line.addSegment(point);

        // Act
        const result = line.isStarted();

        // Assert
        expect(result).toBe(true);
    });

    it('removeSegments should remove segments (ie not draw on canvas)', () => {
        // Arrange
        line.addSegment(point);
        line.removeSegments();

        // Act
        line.draw(ctxStub);

        // Assert
        expect(ctxStub.lineTo).not.toHaveBeenCalled();
    });

    it('draw should not draw a loop when three far segments are added', () => {
        // Arrange
        const point1 = { x: MAXIMUM_DISTANCE_LOOP, y: MAXIMUM_DISTANCE_LOOP };
        const point2 = { x: MAXIMUM_DISTANCE_LOOP * 2, y: MAXIMUM_DISTANCE_LOOP * 2 };

        const expectedPath = new Path2D();
        expectedPath.lineTo(point.x, point.y);
        expectedPath.lineTo(point1.x, point1.y);
        expectedPath.lineTo(point2.x, point2.y);

        line.addSegment(point);
        line.addSegment(point1);
        line.addSegment(point2);

        // Act
        line.draw(ctxStub);

        // Assert
        expect(ctxStub.stroke).toHaveBeenCalledWith(expectedPath);
    });

    it('draw should draw a loop when more than two near segments are added', () => {
        // Arrange
        const point1 = { x: MAXIMUM_DISTANCE_LOOP / 2, y: MAXIMUM_DISTANCE_LOOP / 2 };
        const point2 = { x: MAXIMUM_DISTANCE_LOOP / 2, y: MAXIMUM_DISTANCE_LOOP / 2 };

        const expectedPath = new Path2D();
        expectedPath.lineTo(point.x, point.y);
        expectedPath.lineTo(point1.x, point1.y);
        expectedPath.lineTo(point.x, point.y);

        line.addSegment(point);
        line.addSegment(point1);
        line.addSegment(point2);

        // Act
        line.draw(ctxStub);

        // Assert
        expect(ctxStub.stroke).toHaveBeenCalledWith(expectedPath);
    });

    it('drawPreview should set the preview vertex to startpoint position when loop can be added', () => {
        // Arrange
        let factor: number = 2 * 2 * 2;
        const point1 = { x: MAXIMUM_DISTANCE_LOOP / factor, y: MAXIMUM_DISTANCE_LOOP / factor };
        factor /= 2;
        const point2 = { x: MAXIMUM_DISTANCE_LOOP / factor, y: MAXIMUM_DISTANCE_LOOP / factor };
        factor /= 2;
        const point3 = { x: MAXIMUM_DISTANCE_LOOP / factor, y: MAXIMUM_DISTANCE_LOOP / factor };

        const expectedPath = new Path2D();
        expectedPath.lineTo(point.x, point.y);
        expectedPath.lineTo(point1.x, point1.y);
        expectedPath.lineTo(point2.x, point2.y);
        expectedPath.lineTo(point.x, point.y);

        line.addSegment(point);
        line.addSegment(point1);
        line.addSegment(point2);
        line.addPreviewSegment(point3);

        // Act
        line.drawPreview(ctxStub);

        // Assert
        expect(ctxStub.stroke).toHaveBeenCalledWith(expectedPath);
    });

    it('drawPreview should not chnage the preview vertex position when loop can not be added', () => {
        // Arrange
        let factor = 1;
        const point1 = { x: MAXIMUM_DISTANCE_LOOP * factor, y: MAXIMUM_DISTANCE_LOOP * factor };
        factor *= 2;
        const point2 = { x: MAXIMUM_DISTANCE_LOOP * factor, y: MAXIMUM_DISTANCE_LOOP * factor };
        factor *= 2;
        const point3 = { x: MAXIMUM_DISTANCE_LOOP * factor, y: MAXIMUM_DISTANCE_LOOP * factor };

        const expectedPath = new Path2D();
        expectedPath.lineTo(point.x, point.y);
        expectedPath.lineTo(point1.x, point1.y);
        expectedPath.lineTo(point2.x, point2.y);
        expectedPath.lineTo(point3.x, point3.y);

        line.addSegment(point);
        line.addSegment(point1);
        line.addSegment(point2);
        line.addPreviewSegment(point3);

        // Act
        line.drawPreview(ctxStub);

        // Assert
        expect(ctxStub.stroke).toHaveBeenCalledWith(expectedPath);
    });
});

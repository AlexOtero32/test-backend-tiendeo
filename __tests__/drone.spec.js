const Drone = require('../classes/Drone');

let drone = null;

beforeEach(() => {
    drone = new Drone(3, 4, 'N');
});

describe('Clase Drone', function () {
    it('Incluye posición, orientación y posición inicial', function () {
        expect(drone.x).toBe(3);
        expect(drone.initialX).toBe(3);

        expect(drone.y).toBe(4);
        expect(drone.initialY).toBe(4);

        expect(drone.orientation).toBe('N');
    });

    it('.turn(L) permite girar a la izquierda', function () {
        drone.turn('L');

        expect(drone.orientation).toBe('O');
    });

    it('.turn(R) permite girar a la derecha', function () {
        drone.turn('R');

        expect(drone.orientation).toBe('E');
    });

    it('.move(area) mueve el drone una posición hacia adelante', function () {
        drone.move({ x: 5, y: 5 });

        expect(drone.y).toBe(5);

        // Orientamos el drone hacia el este para que aumente su X
        drone.turn('R');

        drone.move({ x: 5, y: 5 });
        expect(drone.x).toBe(4);
    });

    it('.move(area) no mueve el drone si ya está al borde del área', function () {
        const area = { x: 3, y: 4 };

        drone.move(area);

        expect(drone.y).toBe(4);

        // Orientamos el drone hacia el este para que aumente su X
        drone.turn('R');
        drone.move(area);

        expect(drone.x).toBe(3);

        // Giramos el drone 180 grados y comprobamos que no se sale del rectángulo hacia el oeste
        drone.turn('R');
        drone.turn('R');

        drone.move(area); // 2
        drone.move(area); // 1
        drone.move(area); // 0
        drone.move(area); // 0

        expect(drone.x).toBe(0);

        // Comprobamos lo mismo hacia el sur
        drone.turn('L');

        drone.move(area); // 3
        drone.move(area); // 2
        drone.move(area); // 1
        drone.move(area); // 0
        drone.move(area); // 0

        expect(drone.y).toBe(0);
    });

    it('.canMove(area) comprueba si el drone se puede mover dentro del área', function () {
        expect(drone.canMove({ x: 3, y: 4 })).toBe(false);

        drone.turn('R');
        expect(drone.canMove({ x: 3, y: 4 })).toBe(false);
    });

    it('El Drone ejecuta las instrucciones correctamente', function () {
        drone.executeInstructions({ x: 5, y: 5 }, 'LMLMLMLMMLMLMLMLMM');

        expect(drone.x).toBe(3);
        expect(drone.y).toBe(5);
        expect(drone.orientation).toBe('N');
    });

    it('El drone vuelve a casa correctamente', function () {
        drone.executeInstructions({ x: 5, y: 5 }, 'LMLMLMLMMLMLMLMLMM');

        drone.returnHome({ x: 5, y: 5 });

        expect(drone.x).toEqual(drone.initialX);
        expect(drone.y).toEqual(drone.initialY);
    });
});

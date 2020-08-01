class Drone {
    constructor(x, y, orientation) {
        this.initialX = x;
        this.initialY = y;
        this.x = x;
        this.y = y;
        this.orientation = orientation;
    }

    /**
     * Gira el drone 90 grados a la izquierda (L) o derecha (R)
     *
     * @param {string} direction
     */
    turn(direction) {
        const cardinalPoints = ['N', 'E', 'S', 'O'];

        const index = cardinalPoints.indexOf(this.orientation);

        // Mueve la orientación una posición a la izquierda en el array
        if (direction === 'L') {
            if (index === 0) {
                this.orientation = cardinalPoints[3];
            } else {
                this.orientation = cardinalPoints[index - 1];
            }
        }

        // Mueve la orientación una posición a la derecha en el array
        if (direction === 'R') {
            // Utiliza el módulo para obtener el nuevo índice
            // Si el índice es 3, el nuevo índice es ((3 + 1) % 4) = 0
            this.orientation =
                cardinalPoints[(index + 1) % cardinalPoints.length];
        }
    }

    /**
     * Permite comprobar si el drone podría moverse sin salirse del área designada
     *
     * @param {object} area
     */
    canMove(area) {
        if (this.orientation === 'N' && this.y === area.y) return false;
        if (this.orientation === 'S' && this.y === 0) return false;
        if (this.orientation === 'E' && this.x === area.x) return false;
        if (this.orientation === 'O' && this.x === 0) return false;
        return true;
    }

    /**
     *  @param {object} area
     *
     * Mueve el drone una posición hacia adelante, dependiendo de hacia dónde esté mirando
     */
    move(area) {
        // console.log('move', area);
        if (this.canMove(area)) {
            switch (this.orientation) {
                case 'N':
                    this.y += 1;
                    break;
                case 'S':
                    this.y -= 1;
                    break;
                case 'E':
                    this.x += 1;
                    break;
                case 'O':
                    this.x -= 1;
                    break;
            }
        }
    }

    executeInstructions(area, instructions) {
        // Separamos las instrucciones en un array y ejecutamos cada una por orden
        instructions.split('').forEach((movement) => {
            switch (movement) {
                case 'L':
                case 'R':
                    this.turn(movement);
                    break;
                case 'M':
                    this.move(area);
                    break;
            }
        });
    }

    /**
     * Devuelve el drone a su posición inicial
     */
    returnHome(area) {
        // Si el drone ya está en su posición inicial, abortamos
        if (this.x === this.initialX && this.y === this.initialY) {
            return;
        }

        // Si está a la izquierda (oeste) de la posición inicial o a la derecha (este)
        // giramos hasta que el drone mire en dirección al origen
        //  y avanzamos hasta que el parámetro X coincida
        // Realizamos lo mismo con el eje Y
        ['x', 'y'].forEach((axis) => {
            // Si ya está alineado en este eje, abortar
            if (this[axis] === this[`initial${axis.toUpperCase()}`]) {
                return;
            }

            // Comprobamos qué orientación necesitamos
            let neededOrientation = '';
            if (this[axis] < this[`initial${axis.toUpperCase()}`]) {
                // Si el valor de la posición es menor y el eje es X, el drone debe mirar al este para aumentar el valor
                // Si el eje es Y, el drone debe mirar al norte
                neededOrientation = axis === 'x' ? 'E' : 'N';
            } else {
                // Si el valor de la posición es mayor y el eje es X, el drone debe mirar al oeste para disminuír el valor
                // Si el eje es Y, el drone debe mirar al sur
                neededOrientation = axis === 'x' ? 'O' : 'S';
            }
            // Orientamos el drone correctamente
            if (this.orientation !== neededOrientation) {
                while (this.orientation !== neededOrientation) {
                    this.turn('L');
                }
            }

            // Movemos el drone hacia adelante hasta que los ejes coincidan
            while (this[axis] !== this[`initial${axis.toUpperCase()}`]) {
                this.move(area);
            }
        });
    }
}

module.exports = Drone;

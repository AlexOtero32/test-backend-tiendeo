class Drone {
    constructor(initialPosition, orientation) {
        this.initialPosition = initialPosition;
        this.position = initialPosition;
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
     *  @param {object} area
     *
     * Mueve el drone una posición hacia adelante, dependiendo de hacia dónde esté mirando
     */
    move(area) {
        if (this.canMove(area)) {
            switch (this.orientation) {
                case 'N':
                    this.position.y += 1;
                    break;
                case 'S':
                    this.position.y -= 1;
                    break;
                case 'E':
                    this.position.x += 1;
                    break;
                case 'O':
                    this.position.x -= 1;
                    break;
            }
        }
    }

    /**
     * Permite comprobar si el drone podría moverse sin salirse del área designada
     *
     * @param {object} area
     */
    canMove(area) {
        if (this.orientation === 'N' && this.position.y == area.y) return false;
        if (this.orientation === 'S' && this.position.y == 0) return false;
        if (this.orientation === 'E' && this.position.x == area.x) return false;
        if (this.orientation === 'O' && this.position.x == 0) return false;
        return true;
    }
}

module.exports = Drone;

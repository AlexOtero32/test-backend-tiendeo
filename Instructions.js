const fs = require('fs');
const path = require('path');
const readline = require('readline');

module.exports = class Instructions {
    constructor() {
        this.filename = '';
        this.rawInstructions = '';
        this.instructions = null;
    }

    async getInstructionsFile() {
        let filename = '',
            contents = null;

        // Solicitamos el nombre del archivo hasta obtener un archivo válido
        try {
            do {
                this.filename = await this.askForFileName();
            } while (!this.filename);
        } catch (err) {
            console.error('Error:', err);
        }

        // Leemos el archivo y devolvemos los datos que contiene
        try {
            contents = fs.readFileSync(this.filename, 'utf8');
        } catch (err) {
            console.error(`Se ha producido un error: ${err.message}`);
            process.exit();
        }

        this.rawInstructions = contents;
    }

    async askForFileName() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        // Devolvemos en forma de promise para que el programa espere a que el usuario introduzca un fichero
        return new Promise((resolve) =>
            rl.question(
                'Introduzca la ruta del archivo TXT con las instrucciones:\n',
                (answer) => {
                    // Comprobamos que el archivo existe y es un TXT
                    if (
                        answer &&
                        fs.existsSync(answer) &&
                        path.extname(answer) === '.txt'
                    ) {
                        resolve(answer);
                    } else resolve(null);
                    rl.close();
                }
            )
        );
    }

    parseInstructions() {
        if (!this.rawInstructions) {
            return;
        }

        // Expresión regular que comprueba los puntos de inicio y orientación de los drones
        const coordsRegex = new RegExp(/^(\d+) (\d+) [NSEO]$/m);
        const movementRegex = new RegExp(/^[LRM]+$/m);

        // Parseamos las instrucciones línea a línea
        // Comprobamos que sean correctas (se adaptan a la especificación)
        const instructionsArray = this.rawInstructions
            .split('\r\n')
            .map((line, index) => {
                // Comprobamos la primera línea, que indica el área a sobrevolar
                if (index === 0) {
                    const items = line.split(' ');
                    if (
                        items.length !== 2 ||
                        isNaN(items[0]) ||
                        isNaN(items[1])
                    ) {
                        return null;
                    } else {
                        return { x: parseInt(items[0]), y: parseInt(items[1]) };
                    }
                }

                // Comprobamos las líneas impares a partir de la primera (0), que contendrán los puntos de inicio de cada drone
                if (index % 2 === 1) {
                    if (!coordsRegex.test(line)) {
                        return null;
                    }

                    const position = line.split(' ');
                    return {
                        x: parseInt(position[0]),
                        y: parseInt(position[1]),
                        orientation: position[2],
                    };
                }

                // El resto de líneas, las que contienen las instrucciones de movimiento
                if (index % 2 === 0) {
                    if (!movementRegex.test(line)) {
                        return null;
                    }
                }
                return line;
            });

        // Si alguna de las instrucciones no es válida, devolvemos null
        // El array debe tener una primera línea que indica el área y una serie de pares de líneas
        // Por tanto, si la longitud del array es par, devolvemos null
        if (
            instructionsArray.includes(null) ||
            instructionsArray.length % 2 === 0
        ) {
            this.instructions = null;
            return;
        }

        // Separamos los pares de líneas en objetos
        const drones = [];
        for (let i = 1; i < instructionsArray.length; i += 2) {
            drones.push({
                position: instructionsArray[i],
                movements: instructionsArray[i + 1],
            });
        }

        const parsedInstructions = {
            area: instructionsArray[0],
            drones,
        };

        // Devuelve el objeto con las isntrucciones
        this.instructions = parsedInstructions;
    }
};

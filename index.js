const fs = require('fs');
const path = require('path');
const readline = require('readline');

const Drone = require('./Drone');

main();

async function main() {
    // Solicitamos que el usuario introduzca el fichero con las instrucciones
    const contents = await getInstructionsFile();

    // Transformamos el texto plano del archivo a las instrucciones que necesitamos ejecutar
    const instructions = parseInstructions(contents);

    // Si el parseo de las instrucciones ha devuelto null, hay un error en las instrucciones
    if (!instructions) {
        console.error('Error: Instrucciones no válidas');
        process.exit();
    }

    const { area, drones } = instructions;

    drones.forEach((droneSpecification) => {
        const {
            movements,
            position: { x, y, orientation },
        } = droneSpecification;
        const drone = new Drone(x, y, orientation);

        // Procedemos a mover cada uno de los drones según sus especificaciones, y en el área indicada
        drone.executeInstructions(area, movements);

        // Mostramos como salida la posición y orientación final de cada drone
        console.log(drone.x, drone.y, drone.orientation);

        // Enviamos al drone de vuelta a casa
        drone.returnHome(area);
    });
}

async function getInstructionsFile() {
    let filename = '',
        contents = null;

    // Solicitamos el nombre del archivo hasta obtener un archivo válido
    try {
        do {
            filename = await askForFileName();
        } while (!filename);
    } catch (err) {
        console.error('Error:', err);
    }

    // Leemos el archivo y devolvemos los datos que contiene
    try {
        contents = fs.readFileSync(filename, 'utf8');
    } catch (err) {
        console.error(`Se ha producido un error: ${err.message}`);
        process.exit();
    }

    return contents;
}

async function askForFileName() {
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

function parseInstructions(plainInstructions) {
    // Expresión regular que comprueba los puntos de inicio y orientación de los drones
    const coordsRegex = new RegExp(/^(\d+) (\d+) [NSEO]$/m);
    const movementRegex = new RegExp(/^[LRM]+$/m);

    // Parseamos las instrucciones línea a línea
    // Comprobamos que sean correctas (se adaptan a la especificación)
    const instructionsArray = plainInstructions
        .split('\r\n')
        .map((line, index) => {
            // Comprobamos la primera línea, que indica el área a sobrevolar
            if (index === 0) {
                const items = line.split(' ');
                if (items.length !== 2 || isNaN(items[0]) || isNaN(items[1])) {
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
        return null;
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
    return parsedInstructions;
}

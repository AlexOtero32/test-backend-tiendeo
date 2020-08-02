const Drone = require('./classes/Drone');
const InstructionsParser = require('./classes/Instructions');

main();

async function main() {
    // Solicitamos que el usuario introduzca el fichero con las instrucciones
    const parser = new InstructionsParser();
    await parser.getInstructionsFile();

    // Transformamos el texto plano del archivo a las instrucciones que necesitamos ejecutar
    parser.parseInstructions();

    // Si el parseo de las instrucciones ha devuelto null, hay un error en las instrucciones
    if (!parser.instructions) {
        console.error('Error: Instrucciones no válidas');
        process.exit();
    }

    const { area, drones } = parser.instructions;

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

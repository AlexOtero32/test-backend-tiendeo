const fs = require('fs');
const path = require('path');
const readline = require('readline');

main();

async function main() {
    const contents = await getFileContents();
}

async function getFileContents() {
    // Solicitamos el nombre del archivo hasta obtener un archivo válido
    let filename = '';

    try {
        do {
            filename = await askForFileName();
        } while (!filename);
    } catch (err) {
        console.error('Error:', err);
    }

    // Leemos el archivo y devolvemos los datos que contiene
    try {
        fs.readFile(filename, (err, data) => {
            if (err) {
                console.error(err.message);
                process.exit();
            }
            console.log(data.toString());
        });
    } catch (err) {
        console.error(`Se ha producido un error: ${err.message}`);
        process.exit();
    }
}

async function askForFileName() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) =>
        rl.question(
            'Introduzca la ruta del archivo TXT con las instrucciones:\n',
            (answer) => {
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

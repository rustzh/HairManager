const { spawn } = require('child_process');
const path = require('path');

function runPython(params) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [path.join(__dirname, 'test.py'), params]);

        let output = '';
        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        // pythonProcess.stderr.on('data', (error) => {
        //     console.error(`Error: ${error}`);
        //     reject(error.toString());
        // });

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                resolve(output);
            } else {
                reject(`Process exited with code ${code}`);
            }
        });
    });
}

module.exports = runPython;
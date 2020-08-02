const InstructionsParser = require('../classes/Instructions');

let parser = null;
beforeEach(async (done) => {
    parser = new InstructionsParser();
    await parser.getInstructionsFile();
    done();
});

jest.mock('readline');
describe('Clase Instructions', function () {
    it('Lee el archivo de instrucciones correctamente', function () {
        expect(parser.rawInstructions).not.toBe('');
    });
});

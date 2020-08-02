module.exports = {
    createInterface: jest.fn().mockReturnValue({
        question: jest
            .fn()
            .mockImplementationOnce((_questionTest, cb) =>
                cb('instructions/correctas.txt')
            ),
        close: jest.fn().mockImplementationOnce(() => undefined),
    }),
};

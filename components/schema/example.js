module.exports = {
    type: 'object',
    properties: {
        phone: {
            type: 'string',
            required: true
        },
        password: {
            type: 'string',
            required: true
        }
    },
    additionalProperties: false
};

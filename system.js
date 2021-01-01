'use strict';

let sys = require('./operations/system');

module.exports = function (){
    setInterval(async function (){
            await new sys.func_payment_for_class()
        },
        60000 // Раз в 1 час
    );
}


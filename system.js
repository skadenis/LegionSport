'use strict';

let sys = require('./operations/system');


setInterval(async function (){
    await new sys.func_payment_for_class()
    },
    60000*60 // Раз в 1 час
);

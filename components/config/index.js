module.exports = {
    database:{
        user:  'root',
        host: 'localhost',
        database: 'legion',
        password: 'Tutanu2211',
        port: 5432,
        max: '',
    },
    sms:{
        token: '',
        url: '',
        code_length: '',
        alphaname_id: 1173
    },
    jwt:{
        secretKey: "ILI3FpV5s$B2JnHqNqVYWg1OHN5~SbUj",
        algorithm: 'HS256',
        expires: 2880, //in minutes(two days)
        schema: ''
    },
    mail:{
        email:'online_academy_1@yahoo.com',
        host: 'smtp.mail.yahoo.com',
        port: 465,
        secure: false, // use TLS
        auth: {
            user: "online_academy_1@yahoo.com",
            pass: "Des_01112020"
        }
    },
};

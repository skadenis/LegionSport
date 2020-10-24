let express = require('express');
let router = express.Router();


let Policy = require('cors');
let Schema = require('../components/functions/schema');
let RequestFormat = require('../components/schema/RequestFormat');

const verifyToken = require('../components/functions/Token');
const CheckAuthorization = require('../components/functions/CheckAuthorization');
const ManageRights = require('../components/functions/Rights/ManageSystemUsers');

let system = require('../operations/system_users');

router.post('/auth', Policy, async function(req, res, next) {
    // Обязательно надо после настроить SchemaJS
    // Обязательно настроить для учетных записей параоль перевод в хеш md5

    switch (await new Schema(await RequestFormat.auth()).validate(req.body)) {
        case true:
            let data = await new system().auth(req.body);
            res.json(data);
            break;
        case false:
            res.status(500);
            res.json({error:"Server error"});
            break;
        default:
            res.status(400);
            res.json({error:"Unexpected data format"});
            break;
    }



});
router.get('/all', Policy, verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    // Обязательно надо после настроить SchemaJS
    // Обязательно настроить для учетных записей параоль перевод в хеш md5
    let data = await new system().get_all_users();
    res.json(data);
});
router.get('/:id', Policy, verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    // Обязательно надо после настроить SchemaJS
    // Обязательно настроить для учетных записей параоль перевод в хеш md5
    let data = await new system().get_user_info({id: req.params.id});
    res.json(data);
});
router.post('/create', Policy, verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    // Обязательно надо после настроить SchemaJS
    // Обязательно настроить для учетных записей параоль перевод в хеш md5

    switch (await new Schema(await RequestFormat.create_system_user()).validate(req.body)) {
        case true:
            let data = await new system().create_system_user(req.body);
            res.json(data);
            break;
        case false:
            res.status(500);
            res.json({error:"Server error"});
            break;
        default:
            res.status(400);
            res.json({error:"Unexpected data format"});
            break;
    }



});
router.post('/edit', Policy, verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    // Обязательно надо после настроить SchemaJS
    // Обязательно настроить для учетных записей параоль перевод в хеш md5
    switch (await new Schema(await RequestFormat.edit_system_user()).validate(req.body)) {
        case true:
            let data = await new system().edit_system_user(req.body);
            res.json(data);
            break;
        case false:
            res.status(500);
            res.json({error:"Server error"});
            break;
        default:
            res.status(400);
            res.json({error:"Unexpected data format"});
            break;
    }

});
router.post('/delete', Policy, verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    // Обязательно надо после настроить SchemaJS
    // Обязательно настроить для учетных записей параоль перевод в хеш md5

    switch (await new Schema(await RequestFormat.delete_system_user()).validate(req.body)) {
        case true:
            let data = await new system().delete_system_user(req.body);
            res.json(data);
            break;
        case false:
            res.status(500);
            res.json({error:"Server error"});
            break;
        default:
            res.status(400);
            res.json({error:"Unexpected data format"});
            break;
    }

});

module.exports = router;

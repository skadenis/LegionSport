let express = require('express');
let router = express.Router();

const verifyToken = require('../components/functions/Token');
const CheckAuthorization = require('../components/functions/CheckAuthorization');
const ManageRights = require('../components/functions/Rights/ManageSystemUsers');

let system = require('../operations/system_users');

router.post('/auth', async function(req, res, next) {
    // Обязательно надо после настроить SchemaJS
    // Обязательно настроить для учетных записей параоль перевод в хеш md5
    let data = await new system().auth(req.body);
    res.json(data);
});
router.get('/all', verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    // Обязательно надо после настроить SchemaJS
    // Обязательно настроить для учетных записей параоль перевод в хеш md5
    let data = await new system().get_all_users();
    res.json(data);
});
router.get('/:id', verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    // Обязательно надо после настроить SchemaJS
    // Обязательно настроить для учетных записей параоль перевод в хеш md5
    let data = await new system().get_user_info({id: req.params.id});
    res.json(data);
});
router.post('/create', verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    // Обязательно надо после настроить SchemaJS
    // Обязательно настроить для учетных записей параоль перевод в хеш md5
    let data = await new system().create_system_user(req.body);
    res.json(data);
});
router.post('/edit', verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    // Обязательно надо после настроить SchemaJS
    // Обязательно настроить для учетных записей параоль перевод в хеш md5
    let data = await new system().edit_system_user(req.body);
    res.json(data);
});
router.post('/delete', verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    // Обязательно надо после настроить SchemaJS
    // Обязательно настроить для учетных записей параоль перевод в хеш md5
    let data = await new system().delete_system_user(req.body);
    res.json(data);
});

module.exports = router;

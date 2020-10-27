'use strict';
let express = require('express');
let router = express.Router();

let Policy = require('cors');
let Schema = require('../components/functions/schema');
let RequestFormat = require('../components/schema/RequestFormat');

const verifyToken = require('../components/functions/Token');
const CheckAuthorization = require('../components/functions/CheckAuthorization');
const ManageRights = require('../components/functions/Rights/ManageChilds');

let system = require('../operations/representatives');

router.post('/get-by-child-id', Policy(), verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    // Обязательно надо после настроить SchemaJS

    switch (await new Schema(await RequestFormat.representatives_by_child_id()).validate(req.body)) {
        case true:
            let data = await new system().get_child_representatives(req.body);
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
// router.post('/create', Policy(), verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
//     // Обязательно надо после настроить SchemaJS
//     // Обязательно настроить для учетных записей параоль перевод в хеш md5
//
//     switch (await new Schema(await RequestFormat.representatives_add()).validate(req.body)) {
//         case true:
//             res.json(data);
//             break;
//         case false:
//             res.status(500);
//             res.json({error:"Server error"});
//             break;
//         default:
//             res.status(400);
//             res.json({error:"Unexpected data format"});
//             break;
//     }
//
//
//
// });
router.post('/edit', Policy(), verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    // Обязательно надо после настроить SchemaJS
    // Обязательно настроить для учетных записей параоль перевод в хеш md5
    switch (await new Schema(await RequestFormat.representatives_edit()).validate(req.body)) {
        case true:
            let data;
            if(req.body.id === 0){
                data = await new system().add_child_representatives(req.body);
            }else {
                data = await new system().edit_representative(req.body);
            }
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
router.post('/delete', Policy(), verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    // Обязательно надо после настроить SchemaJS
    // Обязательно настроить для учетных записей параоль перевод в хеш md5

    switch (await new Schema(await RequestFormat.representatives_delete()).validate(req.body)) {
        case true:
            let data = await new system().delete_representative(req.body);
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
router.get('/:id', Policy(), verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    let data = await new system().get_info({id: req.params.id});
    res.json(data);
});

module.exports = router;

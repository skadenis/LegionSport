'use strict';
let express = require('express');
let router = express.Router();

let Policy = require('cors');
let Schema = require('../components/functions/schema');
let RequestFormat = require('../components/schema/RequestFormat');

const verifyToken = require('../components/functions/Token');
const CheckAuthorization = require('../components/functions/CheckAuthorization');
const ManageRights = require('../components/functions/Rights/ManageChilds');
const WatchChilds = require('../components/functions/Rights/WatchChilds');

let teacher = require('../operations/teacher');
let groups = require('../operations/groups');

router.post('/auth', Policy(), async function(req, res, next) {


    switch (await new Schema(await RequestFormat.auth()).validate(req.body)) {
        case true:
            let data = await new teacher().auth(req.body);
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
router.post('/add-to-group', Policy(), verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {

    switch (await new Schema(await RequestFormat.add_to_group_teacher()).validate(req.body)) {
        case true:
            let data = await groups.teacher_add_to_group(req.body);
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
router.get('/all', Policy(), verifyToken, CheckAuthorization, WatchChilds, async function(req, res, next) {
    let data = await teacher.get_all();
    res.json(data);
});
router.get('/:id', Policy(), verifyToken, CheckAuthorization, WatchChilds, async function(req, res, next) {
    let data = await teacher.get_info({id: req.params.id});
    if(data.status === 200){
        let groups_child = await groups.get_child_groups({id: req.params.id});
        data.data.groups = groups_child.groups;
    }

    res.json(data).status(data.status);
});
router.post('/edit', Policy(), verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    switch (await new Schema(await RequestFormat.edit_teacher()).validate(req.body)) {
        case true:
            let id = req.body.id;

            if(req.body.id === 0){
                delete req.body.id;
                let data = await teacher.create(req.body);
                id = data.id;
                switch (data.status) {
                    case 200:
                        let data_info = await teacher.get_info({id: id});
                        if(data_info.status === 200){

                            let groups_teacher = await groups.get_teacher_groups({id: id});
                            data_info.data.groups = groups_teacher.groups;
                        }

                        res.json(data_info).status(data_info.status);

                        break;
                    default:
                        res.json({status: 400});
                        break
                }
            }else{
                let data = await teacher.edit(req.body);
                switch (data.status) {
                    case 200:
                        let data_info = await teacher.get_info({id: id});
                        if(data_info.status === 200){
                            let groups_child = await groups.get_teacher_groups({id: id});
                            data_info.data.groups = groups_child.groups;
                        }

                        res.json(data_info).status(data_info.status);

                        break;
                    default:
                        res.json({status: 400});
                        break
                }
            }

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
    switch (await new Schema(await RequestFormat.delete_teacher()).validate(req.body)) {
        case true:
            let data = await teacher.delete(req.body);
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
router.post('/update-password', Policy(), verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    switch (await new Schema(await RequestFormat.update_password()).validate(req.body)) {
        case true:
            let data = await teacher.update_password(req.body);
            res.json(data).status(data.status);


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

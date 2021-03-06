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

let childs = require('../operations/childs');
let cash_transfer = require('../operations/cash_transfer');
let groups = require('../operations/groups');
let representatives = require('../operations/representatives');

let representativesRouter = require('./representatives');
router.use('/representatives', representativesRouter);

// Запросы клиентской части
router.post('/auth', Policy(), async function(req, res, next) {
    switch (await new Schema(await RequestFormat.auth()).validate(req.body)) {
        case true:
            let data = await new childs().auth(req.body);
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
router.get('/get-groups', Policy(), verifyToken, CheckAuthorization, async function(req, res, next) {
    console.log(req);

    let data = await groups.get_child_groups({id: req.user_info.id});
    res.json(data);
});
router.get('/get-lessons', Policy(), verifyToken, CheckAuthorization, async function(req, res, next) {

    let data = await childs.get_child_client_lessons({id: req.user_info.id});
    res.json(data);
});
router.get('/get-active-bills', Policy(), verifyToken, CheckAuthorization, async function(req, res, next) {

    let data = await childs.get_child_active_bills({id: req.user_info.id});
    res.json(data);
});



router.get('/all', Policy(), verifyToken, CheckAuthorization, WatchChilds, async function(req, res, next) {
    let data = await childs.get_all_childs();
    res.json(data);
});
router.get('/:id', Policy(), verifyToken, CheckAuthorization, WatchChilds, async function(req, res, next) {
    let data = await childs.get_child_info({id: req.params.id});
    if(data.status === 200){

        let payments = await cash_transfer.get_child_payments({id: req.params.id});
        let groups_child = await groups.get_child_groups({id: req.params.id});
        let representative = await new representatives().get_child_representatives({child_id: req.params.id});

        data.data.payments = payments.data;
        data.data.groups = groups_child.groups;
        data.data.representatives = representative;
    }

    res.json(data).status(data.status);



});
router.get('/:id/payments', Policy(), verifyToken, CheckAuthorization, WatchChilds, async function(req, res, next) {
    let data = await cash_transfer.get_child_payments({id: req.params.id});
    res.json(data);
});
router.get('/:id/groups', Policy(), verifyToken, CheckAuthorization, WatchChilds, async function(req, res, next) {
    let data = await groups.get_child_groups({id: req.params.id});
    res.json(data);
});
router.post('/add-to-group', Policy(), verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    switch (await new Schema(await RequestFormat.add_to_group()).validate(req.body)) {
        case true:
            let data = await groups.child_add_to_group(req.body);
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
router.post('/remove-from-group', Policy(), verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    switch (await new Schema(await RequestFormat.add_to_group()).validate(req.body)) {
        case true:
            let data = await groups.remove_from_group(req.body);
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
router.post('/edit', Policy(), verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    switch (await new Schema(await RequestFormat.edit_child()).validate(req.body)) {
        case true:
            let id = req.body.id;

            if(req.body.id === 0){
                delete req.body.id;
                let data = await new childs().create_child(req.body);
                id = data.id;
                switch (data.status) {
                    case 200:
                        let data_info = await childs.get_child_info({id: id});
                        if(data_info.status === 200){

                            let payments = await cash_transfer.get_child_payments({id: id});
                            let groups_child = await groups.get_child_groups({id: id});

                            data_info.data.payments = payments.data;
                            data_info.data.groups = groups_child.groups;
                            data_info.data.representatives = [];
                        }

                        res.json(data_info).status(data_info.status);

                        break;
                    default:
                        res.json({status: 400});
                        break
                }
            }else{
                let data = await childs.edit_child(req.body);
                switch (data.status) {
                    case 200:
                        let data_info = await childs.get_child_info({id: id});
                        if(data_info.status === 200){

                            let payments = await cash_transfer.get_child_payments({id: id});
                            let groups_child = await groups.get_child_groups({id: id});

                            data_info.data.representatives =  await new representatives().get_child_representatives({child_id: id});
                            data_info.data.payments = payments.data;
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
    switch (await new Schema(await RequestFormat.delete_child()).validate(req.body)) {
        case true:
            let data = await childs.delete_child(req.body);
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
            let data = await new childs().update_password(req.body)
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
router.post('/add_payment', Policy(), verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    switch (await new Schema(await RequestFormat.add_payment()).validate(req.body)) {
        case true:

            let data = await cash_transfer.create_cash_transfer(req.body);
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

router.post('/edit_payment', Policy(), verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    switch (await new Schema(await RequestFormat.edit_payment()).validate(req.body)) {
        case true:

            let data = await cash_transfer.edit_cash_transfer(req.body);
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

router.post('/delete_payment', Policy(), verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    switch (await new Schema(await RequestFormat.delete_payment()).validate(req.body)) {
        case true:

            let data = await cash_transfer.delete_cash_transfer(req.body);
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

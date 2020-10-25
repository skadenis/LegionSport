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
let payments = require('../operations/cash_transfer');
let groups = require('../operations/groups');

let representativesRouter = require('./representatives');
router.use('/representatives', representativesRouter);

router.get('/all', Policy(), verifyToken, CheckAuthorization, WatchChilds, async function(req, res, next) {
    let data = await new childs().get_all_childs();
    res.json(data);
});
router.get('/:id', Policy(), verifyToken, CheckAuthorization, WatchChilds, async function(req, res, next) {
    let data = await new childs().get_child_info({id: req.params.id});
    res.json(data);
});
router.get('/:id/payments', Policy(), verifyToken, CheckAuthorization, WatchChilds, async function(req, res, next) {
    let data = await new payments().get_child_payments({id: req.params.id});
    res.json(data);
});
router.get('/:id/groups', Policy(), verifyToken, CheckAuthorization, WatchChilds, async function(req, res, next) {
    let data = await new groups().get_child_groups({id: req.params.id});
    res.json(data);
});
router.post('/add-to-group', Policy(), verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {

    switch (await new Schema(await RequestFormat.add_to_group()).validate(req.body)) {
        case true:
            let data = await new groups().child_add_to_group(req.body);
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


router.post('/all_child_in_program', Policy(), verifyToken, CheckAuthorization, WatchChilds, async function(req, res, next) {

    switch (await new Schema(await RequestFormat.get_all_childs_on_program()).validate(req.body)) {
        case true:
            let data = await new childs().get_all_childs_on_program(req.body);
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
router.post('/all_child_in_object', Policy(), verifyToken, CheckAuthorization, WatchChilds, async function(req, res, next) {

    switch (await new Schema(await RequestFormat.get_all_childs_on_obj()).validate(req.body)) {
        case true:
            let data = await new childs().get_all_childs_on_obj(req.body);
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
router.post('/all_child_in_group', Policy(), verifyToken, CheckAuthorization, WatchChilds, async function(req, res, next) {

    switch (await new Schema(await RequestFormat.get_all_childs_on_group()).validate(req.body)) {
        case true:
            let data = await new childs().get_all_childs_on_group(req.body);
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
router.post('/create', Policy(), verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {

    switch (await new Schema(await RequestFormat.add_child()).validate(req.body)) {
        case true:
            let data = await new childs().create_child(req.body);
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

            if(req.body.id === 0){
                delete req.body.id;
                let data = await new childs().create_child(req.body);
                res.json(data);
            }else{
                let data = await new childs().edit_child(req.body);
                res.json(data);
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
            let data = await new childs().delete_child(req.body);
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
router.post('/payments', Policy(), verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    switch (await new Schema(await RequestFormat.payments_child()).validate(req.body)) {
        case true:
            let data = await new childs().get_child_info(req.body);
            if (data.status === 200){
                await cash_transfer.get_child_payments(req.body)
                res.json();
            }else {
                res.json({status:404});
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
router.post('/add_payment', Policy(), verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    switch (await new Schema(await RequestFormat.add_payment()).validate(req.body)) {
        case true:
            let data = await new childs().get_child_info(req.body);
            if (data.status === 200){
                await new payments().create_cash_transfer(req.body);
                res.json({status:200});
            } else {
                res.json({status: 404});
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

module.exports = router;

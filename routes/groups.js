let express = require('express');
let router = express.Router();

let Policy = require('cors');
const verifyToken = require('../components/functions/Token');
const CheckAuthorization = require('../components/functions/CheckAuthorization');
const ManageRights = require('../components/functions/Rights/ManagePrograms');

let groups = require('../operations/groups');

router.get('/all',  Policy(), verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    let data = await groups.get_all();
    res.json(data);
});

router.post('/get-all-by-object', Policy(), verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    let data = await groups.get_all_groups_on_obj({object: req.body.object});
    res.json(data);
});

router.get('/:id', Policy(), verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    let data = await new objects().get_info({id: req.params.id});
    res.json(data);
});

router.post('/edit', Policy(), verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    let data;
    if(req.body.id === 0){
        data = await groups.create(req.body);
    } else {
        data = await groups.edit(req.body);
    }
    res.json(data);
});
router.post('/delete', Policy(), verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    let data = await groups.delete(req.body);
    res.json(data);
});

module.exports = router;

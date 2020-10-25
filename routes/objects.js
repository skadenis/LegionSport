let express = require('express');
let router = express.Router();

const verifyToken = require('../components/functions/Token');
const CheckAuthorization = require('../components/functions/CheckAuthorization');
const ManageRights = require('../components/functions/Rights/ManagePrograms');

let objects = require('../operations/objects');

router.get('/all', verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    let data = await objects.get_all();
    res.json(data);
});

router.post('/get-all-by-program', verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    let data = await objects.get_all_by_program({program_id: req.body.program_id});
    res.json(data);
});

router.get('/:id', verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    let data = await new objects().get_info({id: req.params.id});
    res.json(data);
});

router.post('/edit', verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    let data;
    if(req.body.id === 0){
        data = await objects.create(req.body);
    } else {
        data = await new objects().edit(req.body);
    }
    res.json(data);
});
router.post('/delete', verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    let data = await new objects().delete(req.body);
    res.json(data);
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../libary/sqlBulider');
const app = require('../libary/CommanMethod');
const DB = new db();

router.get('/verify/:auth_key', async (req, res) => {
	const checkAuth = await DB.find('users', 'first', {
		conditions: {
			authorization_key: req.params.auth_key,
		},
	});
	let successData = {
		error: false,
		message: 'Account Verify Successfully',
	};

	if (!checkAuth) {
		successData.error = true;
		successData.message = 'Invaild Url';
	} else {
		checkAuth.status = 1;
		checkAuth.authorization_key = '';
		DB.save('users', checkAuth);
	}
	res.render('verify-account', successData);
});
router
	.route('/change_password/:auth_key/:type?')
	.get(async (req, res) => {
		const { auth_key, type = 0 } = req.params;
		const table = parseInt(type) === 0 ? 'users' : 'admins';
		const checkAuth = await DB.find(table, 'first', {
			conditions: {
				forgot_password_hash: auth_key,
			},
		});
		const successData = {
			error: false,
			success: false,
			message: 'Create New Password',
		};

		if (!checkAuth) {
			successData.error = true;
			successData.success = true;
			successData.message = 'Invaild Url';
			successData.confirmPassword = false;
		}
		res.render('changepassword', successData);
	})
	.post(async (req, res) => {
		const successData = {
			error: true,
			success: true,
			confirmPassword: false,
			message: 'Something Went Wrong',
		};
		const { auth_key, type = 0 } = req.params;
		const table = parseInt(type) === 0 ? 'users' : 'admins';
		const checkAuth = await DB.find(table, 'first', {
			conditions: {
				forgot_password_hash: auth_key,
			},
		});
		if (!checkAuth) {
			successData.confirmPassword = false;
			return res.render('changepassword', successData);
		}
		if (req.body.password.length === 0) {
			successData.message = 'Password Field is Required';
			return res.render('changepassword', successData);
		}
		if (req.body.password !== req.body.confirm_password) {
			successData.confirmPassword = true;
			successData.message = 'Confirm passoword is not match with password';
			return res.render('changepassword', successData);
		}
		await DB.save(table, {
			id: checkAuth.id,
			password: app.createHash(req.body.password),
			forgot_password_hash: '',
		});
		successData.success = true;
		successData.error = false;
		successData.message =
			'New Password updated Successfully. Please Login in app';
		return res.render('changepassword', successData);
	});

router.route('/socketConnect').get((Request, res) => {
	const { user_id = 85 } = Request.query;
	res.render('socketTested', { shopId: user_id });
});

module.exports = router;

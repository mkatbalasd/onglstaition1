const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('home', {
    title: 'لوحة التحكم',
    header: 'لوحة التحكم'
  });
});

module.exports = router;

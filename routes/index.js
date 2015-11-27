var express = require('express');
var router = express.Router();
var Filter = require('../models/filters');
var Site = require('../models/sites');

router.get('/partials/:partial?', function(req, res, next) {
  res.render('partials/' + req.params.partial, {
    layout: null
  });
});

router.get('/filter/:filter?', function(req, res, next) {
  if (!req.user) {
    req.flash('error', 'You must sign on to view this page.');
    return res.redirect('/signon');
  }

  res.render('filter', { 
    title: 'Dewy',
    operators: Filter.getOperators(),
    fields: Filter.getFields(),
    current_filter: Filter.get(filters, req.params.filter),
    user: req.user,
    helpers: {
      choices: function(field, options) {
        var selections;
        choices = Filter.getChoicesByField(Filter.getFields(), field);
        for (var i=0; i<choices.length; i++) {
          selections += options.fn(choices[i]);
        }
        return selections;
      },
      value: function(field, options) {
        value = Filter.getValueByField(Filter.getFields(), field); 
        if (value) {
          return options.fn(this);
        }
      }
    }
  });
});

router.get('/sites/:filter?', function(req, res, next) {
  if (!req.user) {
    req.flash('error', 'You must sign on to view this page.');
    return res.redirect('/signon');
  }

  res.render('sites', { 
    title: 'Dewy',
    sites: Site.getByFilter(req.user, req.params.filter),
    filters: Filter.getByUser(req.user),
    current_filter: Filter.get(filters, req.params.filter),
    message: req.flash('message')[0],
    user: req.user,
    helpers: {
      dots: function(number, options) {
        var dots = '';
        for (var i=0; i<number; i++)
          dots += options.fn(i);
        return dots;
      }
    }
  });
});

module.exports = router;
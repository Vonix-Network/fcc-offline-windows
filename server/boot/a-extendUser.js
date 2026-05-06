import { Observable } from 'rx';
import debugFactory from 'debug';
import { isEmail } from 'validator';

const debug = debugFactory('fcc:user:remote');

function destroyAllRelated(id, Model) {
  return Observable.fromNodeCallback(
    Model.destroyAll,
    Model
  )({ userId: id });
}

module.exports = function(app) {
  var User = app.models.User;
  var UserIdentity = app.models.UserIdentity;
  var UserCredential = app.models.UserCredential;
  var Email = app.models.Email;
  User.observe('before delete', function(ctx, next) {
    debug('removing user', ctx.where);
    var id = ctx.where && ctx.where.id ? ctx.where.id : null;
    if (!id) {
      return next();
    }
    return Observable.combineLatest(
      destroyAllRelated(id, UserIdentity),
      destroyAllRelated(id, UserCredential),
      function(identData, credData) {
        return {
          identData: identData,
          credData: credData
        };
      }
    )
      .subscribe(
        function(data) {
          debug('deleted', data);
        },
        function(err) {
          debug('error deleting user %s stuff', id, err);
          next(err);
        },
        function() {
          debug('user stuff deleted for user %s', id);
          next();
        }
      );
  });

  // set email varified false on user email signup
  // should not be set with oauth signin methods
  User.beforeRemote('create', function(ctx, user, next) {
    var body = ctx.req.body;
    if (body) {
      body.emailVerified = false;
    }
    next();
  });

  // Log user in immediately after registration, then send welcome email
  // as fire-and-forget so email failures never block sign-up.
  User.afterRemote('create', function({ req, res }, user, next) {
    debug('user created');
    const redirect = req.session && req.session.returnTo ?
      req.session.returnTo :
      '/';

    // Fire-and-forget welcome email – do not block login on failure
    if (user.email && isEmail(user.email)) {
      var mailOptions = {
        type: 'email',
        to: user.email,
        from: 'no-reply@vonix.network',
        subject: 'Welcome to Vonix Code Camp!',
        redirect: '/',
        text: [
          'Welcome to Vonix Code Camp!\n\n',
          'Your account has been created successfully.\n',
          'You can now sign in and start working through the curriculum:\n',
          'https://vonix.network\n\n',
          'If you have any questions, feel free to reach out.\n\n',
          'Happy coding!\n',
          '— The Vonix Team'
        ].join('')
      };
      Email.send(mailOptions, function(err) {
        if (err) { debug('welcome email failed (non-fatal): %s', err.message); }
      });
    }

    // Log the user in regardless of email status
    return req.logIn(user, function(err) {
      if (err) { return next(err); }
      req.flash('success', {
        msg: [ "Welcome to Vonix Code Camp! Your account is ready." ]
      });
      return res.redirect(redirect);
    });
  });
};

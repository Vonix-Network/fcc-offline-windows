import passport from 'passport';
import { PassportConfigurator } from 'loopback-component-passport';
import passportProviders from './passport-providers';
import uuid from 'node-uuid';
import { generateKey } from 'loopback-component-passport/lib/models/utils';

import {
  setProfileFromGithub,
  getSocialProvider,
  getUsernameFromProvider
} from './utils/auth';

const passportOptions = {
  emailOptional: true,
  profileToUser(provider, profile) {
    const emails = profile.emails;
    // NOTE(berks): get email or set to null.
    // MongoDB indexs email but can be sparse(blank)
    const email = emails && emails[0] && emails[0].value ?
      emails[0].value :
      null;

    // create random username
    // username will be assigned when camper signups for Github
    const username = 'fcc' + uuid.v4().slice(0, 8);
    const password = generateKey('password');
    let userObj = {
      username: username,
      password: password
    };

    if (email) {
      userObj.email = email;
    }

    if (!(/github/).test(provider)) {
      userObj[getSocialProvider(provider)] = getUsernameFromProvider(
        getSocialProvider(provider),
        profile
      );
    }

    if (/github/.test(provider)) {
      userObj = setProfileFromGithub(userObj, profile, profile._json);
    }
    return userObj;
  }
};

const fields = {
  progressTimestamps: false,
  completedChallenges: false,
  challengeMap: false
};

PassportConfigurator.prototype.init = function passportInit(noSession) {
  this.app.middleware('session:after', passport.initialize());

  if (noSession) {
    return;
  }

  this.app.middleware('session:after', passport.session());

  // Serialization and deserialization is only required if passport session is
  // enabled

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {

    this.userModel.findById(id, { fields }, (err, user) => {
      if (err || !user) {
        return done(err, user);
      }
      // ORM-agnostic points count (works with MongoDB and PostgreSQL)
      this.userModel.findById(
        id,
        { fields: { progressTimestamps: true } },
        (err2, tsUser) => {
          user.points = (tsUser && tsUser.progressTimestamps)
            ? tsUser.progressTimestamps.length
            : 1;
          return done(null, user);
        }
      );
    });
  });
};

export default function setupPassport(app) {
  const configurator = new PassportConfigurator(app);

  configurator.setupModels({
    userModel: app.models.user,
    userIdentityModel: app.models.userIdentity,
    userCredentialModel: app.models.userCredential
  });

  configurator.init();

  Object.keys(passportProviders).map(function(strategy) {
    var config = passportProviders[strategy];

    // Skip OAuth providers whose credentials are not configured
    const isOAuth2 = config.clientID !== undefined;
    const isOAuth1 = config.consumerKey !== undefined;
    if (isOAuth2 && (!config.clientID || !config.clientSecret)) {
      return;
    }
    if (isOAuth1 && (!config.consumerKey || !config.consumerSecret)) {
      return;
    }

    config.session = config.session !== false;
    configurator.configureProvider(
      strategy,
      {
        ...config,
        ...passportOptions
      }
    );
  });
}

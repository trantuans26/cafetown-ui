import routes from "@/router";
import callAPI from "@/api";
import {createAuth}          from '@websanova/vue-auth';
import driverAuthBearer      from '@websanova/vue-auth/dist/drivers/auth/bearer.esm.js';
import driverHttpAxios       from '@websanova/vue-auth/dist/drivers/http/axios.1.x.esm.js';
import driverRouterVueRouter from '@websanova/vue-auth/dist/drivers/router/vue-router.2.x.esm.js';
import driverOAuth2Google    from '@websanova/vue-auth/dist/drivers/oauth2/google.esm.js';
import driverOAuth2Facebook  from '@websanova/vue-auth/dist/drivers/oauth2/facebook.esm.js';

var auth = createAuth({
  plugins: {
      http: callAPI,
      router: routes
  },
  drivers: {
      http: driverHttpAxios,
      auth: driverAuthBearer,
      router: driverRouterVueRouter,
      oauth2: {
          google: driverOAuth2Google,
          facebook: driverOAuth2Facebook,
      }
  },
  options: {
      rolesKey: 'type',
      notFoundRedirect: {name: 'user-account'},
  }
});

export default auth;
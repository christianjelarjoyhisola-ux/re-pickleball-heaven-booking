export default {
  fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === 'www.repickleballheaven.com') {
      url.hostname = 'repickleballheaven.com';
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};

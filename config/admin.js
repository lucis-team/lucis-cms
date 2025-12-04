const getPreviewPathname = (uid, { document, status, previewSecret }) => {
  const { slug, url } = document;

  switch (uid) {
    case "api::dynamic-page.dynamic-page": {
      return `/lp/${url}?status=${status}&secret=${previewSecret}`;
    }
    case "api::article.article": {
      return `/blog/${slug}?status=${status}&secret=${previewSecret}`;
    }
    default: {
      return null;
    }
  }
};

module.exports = ({ env }) => {
  const clientUrl = env("CLIENT_URL");
  const previewSecret = env("PREVIEW_SECRET");

  return {
    auth: {
      secret: env("ADMIN_JWT_SECRET"),
    },
    apiToken: {
      salt: env("API_TOKEN_SALT"),
    },
    transfer: {
      token: {
        salt: env("TRANSFER_TOKEN_SALT"),
      },
    },
    flags: {
      nps: env.bool("FLAG_NPS", true),
      promoteEE: env.bool("FLAG_PROMOTE_EE", true),
    },
    preview: {
      enabled: true,
      config: {
        allowedOrigins: ["https://lucis.life", "https://www.lucis.life"],
        async handler(uid, { documentId, status }) {
          const document = await strapi.documents(uid).findOne({ documentId });
          const pathname = getPreviewPathname(uid, { document, status,previewSecret });

          return `${clientUrl}${pathname}`;
        },
      },
    },
  };
};

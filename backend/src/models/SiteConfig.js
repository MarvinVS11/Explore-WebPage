const { Schema, model } = require('mongoose');

const siteConfigSchema = new Schema(
  {
    key:             { type: String, required: true, unique: true },
    siteName:        { type: String, default: '' },
    logoUrl:         { type: String, default: '' },
    faviconUrl:      { type: String, default: '' },
    videoUrl:        { type: String, default: '' },
    whatsappUrl:     { type: String, default: '' },
    facebookUrl:     { type: String, default: '' },
    instagramUrl:    { type: String, default: '' },
    whatsappImgUrl:  { type: String, default: '' },
    facebookImgUrl:  { type: String, default: '' },
    instagramImgUrl: { type: String, default: '' },
    footerCopyright: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = model('SiteConfig', siteConfigSchema);

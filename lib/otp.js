const schemas = require("./schemas");

class Otp {
  constructor(cfg) {
    Object.assign(this, cfg);
    this.options = this.options || {};
    this.controllers = this.controllers || {};

    // options
    this.options.requireApproval = this.options.requireApproval || false;

    const { mongoose } = cfg;
    this.model =
      cfg.model ||
      mongoose.model(
        "Otp",
        schemas.OTPSchema({
          schema: cfg.schema,
          collectionName: cfg.collectionName,
          fnCreateSchema: cfg.fnCreateSchema,
        })
      );
  }

  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  async createOTP({ address, expiry_duration_in_minutes }) {
    const OTP = this.generateOTP();
    const payload = {
      token: OTP,
      address,
      expires_at: Date.now() + expiry_duration_in_minutes * 60000,
    }; // expires in x mins
    await this.model.findOneAndUpdate({ address }, payload, { upsert: true });
    return payload;
  }

  async verifyOTP({ otp }) {
    const res = await this.model.findOne({ token: otp });
    if (!res) return false;
    const { address, expires_at } = res;
    if (!address || expires_at < Date.now()) return false;
    return true;
  }
}

module.exports = Otp;

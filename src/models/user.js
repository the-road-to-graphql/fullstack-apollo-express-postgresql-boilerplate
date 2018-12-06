import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import isEmail from 'validator/lib/isEmail';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: [isEmail, 'invalid email']
  },
  password: {
    type:String,
    required: true,
    minlength: 7,
    maxlength: 42
  },
  role: {
    type: String
  },
});
UserSchema.statics.findByLogin = async function (login) {
  let user = await this.findOne({
      username: login
  })

  if(!user) {
    user = await this.findOne( {email: login}
    );
  }

  return user;
}
UserSchema.pre('save', async function (){
  this.password = await this.generatePasswordHash()
});

UserSchema.methods.generatePasswordHash = async function() {
  const saltRounds = 10;
  return await bcrypt.hash(this.password, saltRounds);
};

UserSchema.methods.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model('User', UserSchema); 
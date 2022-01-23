export class UserDto {
  id;
  email;
  isActive;
  constructor(model) {
    this.id = model._id;
    this.email = model.email;
    this.isActive = model.isActive;
  }
}

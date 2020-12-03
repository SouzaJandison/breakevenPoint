import { User } from '../models/User';

const userView = {
  render(user: User){
    return{
      id: user.id,
      name: user.name,
      email: user.email
    };
  }
};

export { userView };
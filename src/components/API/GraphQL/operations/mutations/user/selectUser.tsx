import { ReactiveVar } from '@apollo/client';
import { User } from '../../../types.generated';

export default function createSetUser(
  selectedUserVar: ReactiveVar<User | undefined>
) {
  return (user: User): void => {
    selectedUserVar(user);
  };
}

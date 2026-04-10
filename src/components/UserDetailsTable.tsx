import { getAllUsers } from '../api/api';
import PeopleTable from './PeopleTable';

const UserDetailsTable = () => {
  return <PeopleTable fetchAction={getAllUsers} />;
};

export default UserDetailsTable;

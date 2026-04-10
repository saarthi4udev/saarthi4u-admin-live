import { getAllAdmins } from '../api/api';
import PeopleTable from './PeopleTable';

const AdminTable = () => {
  return <PeopleTable fetchAction={getAllAdmins} />;
};

export default AdminTable;

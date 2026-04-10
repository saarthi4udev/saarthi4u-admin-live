import { useAuth } from "../../context/AuthContext";

const Unauthorized = () => {
  const { user } = useAuth();
  return (
    <section id="mainbg">
      <div className="container1">
        <div className="text">
          <h1>Page Not Found</h1>
          <p>We can't seem to find the page you're looking for. Please check your access permissions.</p>
          {!user || (user.role !== 'super' && user.role !== 'admin') ?
            <button onClick={
              () => {
                // remove localstorage
                localStorage.removeItem('token');
                localStorage.removeItem('user');

                // redirect to login page
                window.location.href = '/auth/signin';
              }
            }
              className="button"
            >Go to Login Page</button>
            : <></>}
          {user && user.role == 'super' ?
            <button onClick={
              () => {
                window.location.href = '/dashboard';
              }
            }
              className="button"
            >Go to Dashboard</button>
            : <></>}
        </div>
        <div><img className="image" src="https://omjsblog.files.wordpress.com/2023/07/errorimg.png" alt="" /></div>
      </div>
    </section>
  );
};

export default Unauthorized;

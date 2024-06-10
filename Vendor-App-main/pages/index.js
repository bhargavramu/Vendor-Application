import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Admin_dashboard from './admin_dashboard';
// import Vendor_dashboard from './vendor_dashboard';
// import Vendor_login from './vendor_login';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact={true} path="/" element={<Admin_dashboard />} />
        {/* <Route exact={true} path="/Vendor_login " element={<Vendor_login />} /> */}
        {/* <Route exact={true} path="/" element={<Vendor_password_reset />} /> */}
        {/* <Route exact={true} path="/Vendor_forget_password" element={<Vendor_forget_password />} /> */}
        {/* <Route exact={true} path="/vendor_dashboard" element={<Vendor_dashboard />} /> */}
      </Routes>
    </Router>
  )
}

export default App;

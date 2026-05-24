import Navbar from '../components/Navbar'; // Make sure path is correct
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#fcfcfc]">
      {/* Navbar fixed hai, isliye main content ko top padding deni hogi */}
      <Navbar />
      
      {/* pt-20 navbar ki height hai, isse content niche shift ho jayega */}
      <main className="flex-grow pt-20">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;
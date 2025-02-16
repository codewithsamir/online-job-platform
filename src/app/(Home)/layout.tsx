
import Header from "@/components/Landingpage/Header";
import Footer from "@/components/Landingpage/Footer";


import Resiterwrapper from "@/components/Landingpage/Registerwrapper";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
  <>        
        <Header />
     <Resiterwrapper />

        {children}
        <Footer />
    
      
        </>

  );
}

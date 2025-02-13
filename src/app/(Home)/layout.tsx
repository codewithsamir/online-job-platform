
import Header from "@/components/Landingpage/Header";
import Footer from "@/components/Landingpage/Footer";

import Storewrap from "@/components/Landingpage/Storewrap";
import Resiterwrapper from "@/components/Landingpage/Registerwrapper";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
  <>        <Storewrap>
        <Header />
     <Resiterwrapper />

        {children}
        <Footer />
        </Storewrap>
      
        </>

  );
}

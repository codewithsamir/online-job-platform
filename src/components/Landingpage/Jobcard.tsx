import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import parse from 'html-react-parser'; // Import HTML parser
const Jobcard = ({ data }: any) => {

  return (
    <Card className="w-full sm:w-[300px] h-[320px] p-0 overflow-hidden">
      <CardHeader className="p-0 w-full h-[180px] overflow-hidden relative">
        {/* Replace the image source with a placeholder or actual image link */}
        <Image
          src={data?.companyProfile.logoUrl || "/placeholder-job-image.jpg"} // Fallback image if `imagelink` is not provided
          alt="job image"
          width={300}
          height={180}
          className="w-full h-full object-cover"
        />
        <Button className="bg-[#d83f8696] hover:bg-[#D83F87] hover:text-white absolute top-2 left-2">
          {data?.jobType } {/* Display job type or a default value */}
        </Button>
      </CardHeader>
      <CardContent className="py-2">
        <CardTitle className="text-xl capitalize mb-2">{data?.title}</CardTitle>
        
        <p>
        {data?.category}
 </p>
 <p>
 {data?.salaryRange}
 </p>
 
       
       
      </CardContent>
      <CardFooter className="flex justify-center my-1 w-full">
        <Button variant="outline" className="bg-[#d83f8617] border-2 text-sm  text-[#D83F87] border-[#D83F87] hover:bg-[#D83F87] hover:text-white w-full rounded-2xl">
          See Descriptions
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Jobcard;
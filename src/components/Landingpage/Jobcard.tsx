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
    <Card className="w-full sm:w-[350px] p-0 overflow-hidden">
      <CardHeader className="p-0 w-full h-[250px] overflow-hidden relative">
        {/* Replace the image source with a placeholder or actual image link */}
        <Image
          src={data?.companyProfile.logoUrl || "/placeholder-job-image.jpg"} // Fallback image if `imagelink` is not provided
          alt="job image"
          width={350}
          height={250}
          className="w-full h-full object-cover"
        />
        <Button className="bg-[#d83f8696] hover:bg-[#D83F87] hover:text-white absolute top-2 left-2">
          {data?.jobType } {/* Display job type or a default value */}
        </Button>
      </CardHeader>
      <CardContent className="py-2">
        <CardTitle className="text-xl mb-2">{data?.title}</CardTitle>
        <CardDescription className="text-lg">
        {/* {data?.description ? parse(data.description.slice(0, 50)) : ""} */}
        {data?.category}
 {/* Display first 50 characters of the description */}
        </CardDescription>
        <CardDescription className="text-lg">
        {/* {data?.description ? parse(data.description.slice(0, 50)) : ""} */}
      {data?.salaryRange}
 {/* Display first 50 characters of the description */}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-center my-2 w-full">
        <Button className="bg-[#d83f8617] border-2 text-[#D83F87] border-[#D83F87] hover:bg-[#D83F87] hover:text-white w-full rounded-2xl">
          See Descriptions
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Jobcard;
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Searchbox = () => {
  return (

    <div className="search sm:flex sm:border-2 sm:border-white rounded-lg w-full">
      <Input type="text" placeholder="Search your Job title" className="text-white text-lg sm:border-none outline-none w-full placeholder:text-white"/>
      <Select >
        <SelectTrigger className="w-full md:w-[350px] text-white text-lg border-none bg-pink-600  sm:rounded-tr-none sm:rounded-br-none">
          <SelectValue placeholder="Select your location"  />
        </SelectTrigger>
        <SelectContent className=" text-lg ">
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectContent>
      </Select>
      <Button className="w-full sm:w-[250px] sm:rounded-tl-none sm:rounded-bl-none">Search</Button>
    </div>

  )
}

export default Searchbox
import * as React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { coursedata } from "@/lib/coursedata"
import Link from "next/link"
// import  Link  from 'next/navigation'

export function Slidercourse() {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full "
    >
      <CarouselContent>
        {coursedata.map((data, index) => (
          <CarouselItem key={index} className="md:basis-1/4">
           <Link href="">
           <div className="p-1">
              <Card className=" h-[260px] overflow-hidden">
                    
                    <img src={data.image} alt={data.title}  className="w-full bg-red-500 h-[200px] object-cover object-center"/>
                    
                <CardContent className="flex aspect-square  justify-center ">
                  {/* <span className="text-3xl font-semibold">{index + 1}</span>
                  < */}
                  <CardTitle className="p-2 text-xl leading-6">{data.title}</CardTitle>
                </CardContent>
              </Card>
            </div>
           </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

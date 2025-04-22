import Image from "next/image"
import Link from "next/link"
import { MapPin, Calendar, Star, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getReviewsById } from "@/actions/GetReviewsById"

const PackageCard = async ({ pkg }) => {
  const formatNumber = (number) => {
    return new Intl.NumberFormat('en-IN').format(number)
  }

  const reviews = await getReviewsById(pkg?._id)

  const rating = reviews.filter(review => review.approved).reduce((acc, review) => acc + review.rating, 0);
  const averageRating = rating / reviews.length;

  const totalReviews = reviews.filter(review => review.approved).length

  return (
    <div className="bg-white shadow-xl border-2 rounded-lg overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 font-barlow">
      <div className="relative h-48">

        {pkg?.basicDetails?.thumbnail?.url ? <Image src={pkg?.basicDetails?.thumbnail?.url} alt={pkg?.packageName} width={800} height={600} quality={10} priority className="object-cover h-full" /> : <div className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"><Loader2 className=" h-8 w-8 text-primary animate-spin" /></div>}

        <div className="absolute top-3 right-3 bg-blue-100 border-2 border-blue-600 text-black px-3 py-1 rounded-full font-semibold">
          ₹<span className="font-bold text-lg">{formatNumber(pkg?.price)}</span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl md:text-2xl font-bold mb-2 line-clamp-1 font-gilda">{pkg?.packageName}</h3>
        <div className="flex items-center text-gray-600 mb-3">
          <Calendar className="h-4 w-4 mr-1" />
          <span className="text-sm fonts">Duration: <span className="font-semibold">{pkg?.basicDetails?.duration} Days {pkg?.basicDetails?.duration - 1} Nights</span></span>
        </div>
        <p className="text-gray-700 mb-4 h-32 capitalize overflow-y-auto"><span className="mb-4 capitalize text-justify whitespace-pre-line" dangerouslySetInnerHTML={{ __html: pkg?.basicDetails?.smallDesc }} /></p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            <span className="ml-1 text-base font-medium">{averageRating || 0}</span>
            <span className="ml-1 text-sm font-medium text-blue-600">({totalReviews || 0} reviews)</span>
          </div>
          <Link href={`/package/${pkg?._id}`}>
            <Button size="lg" className="bg-blue-600 text-lg uppercase hover:bg-blue-500">Learn More</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PackageCard
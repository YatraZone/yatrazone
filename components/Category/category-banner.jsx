import Image from "next/image"

const CategoryBanner = ({ title, bannerImage }) => {
  return (
    <div className="relative h-[200px] md:h-[300px] overflow-hidden md:rounded-xl w-full">
      <Image src={bannerImage} alt={title} quality={25} width={1280} height={720} className="w-full object-cover" priority />
    </div>
  )
}

export default CategoryBanner
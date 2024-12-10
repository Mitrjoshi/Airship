interface I_CustomSkeleton {
  className: string
}

export const CustomSkeleton = ({ className }: I_CustomSkeleton) => {
  return <div className={`${className} skeleton-image`}></div>
}

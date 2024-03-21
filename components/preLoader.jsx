import Image from 'next/image'

export function PreLoader() {
  return (
    <>
      <div className='w-full bg-black px-3 lg:px-20 min-h-screen grid justify-center items-center pb-8 lg:pb-0'>
        <div className='flex justify-center items-center relative'>
          <Image
            src='/orbit.svg'
            alt='preloader'
            width={30}
            height={30}
            className='w-32 h-32 animate-spin relative'
          />
          <Image
            src='/orbit.svg'
            alt='preloader'
            width={30}
            height={30}
            className='w-24 h-24 -animate-spin absolute'
          />
          <Image
            src='/orbit.svg'
            alt='preloader'
            width={30}
            height={30}
            className='w-20 h-20 animate-spin absolute'
          />
        </div>
      </div>
    </>
  )
}

'use client'

import {
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
} from '@ant-design/icons'
import React from 'react'
import { useRouter } from 'next/navigation'

// function Footer() {
//   const router = useRouter()

//   return (
//     <div
//       className='w-full flex justify-between py-5 px-8 bg-[#0e0e0e] border-t border-[#a3a3a3]'
//       id='contact'
//     >
//       <p className='text-base font-bricolage font-light leading-[150%] text-white tracking-wider'>
//         © 2024 Votechain, All Rights Reserved.
//       </p>
//       <div className='flex gap-4 justify-center'>
//         <TwitterOutlined
//           onClick={() => router.push('/')}
//           className='text-white text-2xl cursor-pointer'
//         />
//         <InstagramOutlined
//           onClick={() => router.push('/')}
//           className='text-white text-2xl cursor-pointer'
//         />
//         <FacebookOutlined
//           onClick={() => router.push('/')}
//           className='text-white text-2xl cursor-pointer'
//         />
//       </div>
//     </div>
//   )
// }

// export default Footer

export function Footer() {

  const router = useRouter();

  return (
    <div className="grid bg-[#0e0e0e] grid-cols-3 gap-1 pt-32 pb-10 px-2 lg:px-10">
      <div className="col-span-2 grid gap-3">
        <div className="grid lg:grid-cols-8 gap-3">
        <a
          href={`/`}
          className={"text-white flex text-sm justify-start lg:justify-center  cursor-pointer hover:opacity-60 mr-8"}
        >
          Home
        </a>
        <a
          href={`/governance`}
          className={"text-white flex text-sm justify-start lg:justify-center  cursor-pointer hover:opacity-60 mr-8"}
        >
          Governance
        </a>
        <a
          href={`/community`}
          className={"text-white flex text-sm justify-start lg:justify-center  cursor-pointer hover:opacity-60 mr-8"}
        >
          Community
        </a>
        <a
          href={`/about`}
          className={"text-white flex text-sm justify-start lg:justify-center  cursor-pointer hover:opacity-60 mr-8"}
        >
          About
        </a>
        <a
          href={`/blogs`}
          className={"text-white flex text-sm justify-start lg:justify-center  cursor-pointer hover:opacity-60 mr-8"}
        >
          Blog
        </a>
        <a
          href={`/faq`}
          className={"text-white flex text-sm justify-start lg:justify-center  cursor-pointer hover:opacity-60 mr-8"}
        >
          FAQ
        </a>
        </div>
        <div className="w-4/5">
          <p className="text-white text-sm font-poppins text-opacity-60">
            Any inquires for Votechain - Contact {" "}
            <span className="text-white text-opacity-100 font-semibold hover:text-opacity-60 tracking-widest ps-2">
              <a href="https://evotechain.vercel.app/">{" "}evotechain.vercel.app</a>
            </span>
          </p>
        </div>
      </div>
      <div className="flex gap-4 justify-end items-end">
        <TwitterOutlined
          onClick={() => navigate("https://twitter.com")}
          className="text-2xl text-white text-opacity-60 hover:text-opacity-30 cursor-pointer"
        />
        <InstagramOutlined
          onClick={() => navigate("https://github.com")}
          className="text-2xl text-white text-opacity-60 hover:text-opacity-30 cursor-pointer"
        />
        <FacebookOutlined
          onClick={() => navigate("https://www.linkedin.com/")}
          className="text-2xl text-white text-opacity-60 hover:text-opacity-30 cursor-pointer"
        />
      </div>
    </div>
  );
}


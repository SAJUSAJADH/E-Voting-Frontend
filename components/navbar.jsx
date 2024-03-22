'use client'

import { CloseOutlined, MenuOutlined, RightOutlined } from '@ant-design/icons'
import React from 'react'
import { useRouter } from 'next/navigation'

function Navbar({ route }) {
  const [isToggle, setIsToggle] = React.useState(false)
  const router = useRouter()

  const Open = () => {
    setIsToggle(!isToggle)
  }

  const ToggleIcon = () => {
    if (!isToggle) {
      return (
        <MenuOutlined
          onClick={Open}
          className='text-lg transition-transform duration-700 ease-in-out text-white'
        />
      )
    } else {
      return (
        <CloseOutlined
          onClick={Open}
          className='text-lg transition-transform duration-700 ease-in-out text-white'
        />
      )
    }
  }

  const Menu = [
    { navName: 'Home', Link: '/', route: 'home' },
    { navName: 'Governance', Link: '/governance', route: 'governance' },
    { navName: 'Community', Link: '/community', route: 'community' },
    { navName: 'About', Link: '/about', route: 'about' },
    { navName: 'Blog', Link: '/blogs', route: 'blogs' },
    { navName: 'FAQ', Link: '/faq', route: 'faq' },
  ]

  const MenuMapping = Menu.map((menu, index) => {
    return (
      <div key={index} className='flex justify-between items-center'>
        <a
          href={menu.Link}
          onClick={Open}
          className='text-white hover:text- text-lg font-light font-bricolage'
        >
          {menu.navName}
        </a>
        <RightOutlined className='text-white hover:text- text-lg font-light font-bricolage' />
      </div>
    )
  })

  return (
    <>
      <div className='w-full flex justify-center items-center'>
        <div className='mx-auto px-3 lg:px-10 rounded-2xl fixed top-3 md:top-8  shadow-md w-full md:w-5/6 z-50 bg-[#0e0e0e] flex justify-between py-4 items-center'>
          <div className='flex'>
            <p
              onClick={() => router.push('/')}
              className='text-2xl text-white font-bricolage font-medium cursor-pointer'
            >
              VOTECHAIN
            </p>
          </div>
          <div className='hidden lg:flex justify-between gap-6'>
            {Menu.map((menu, index) => (
              <a
                key={index}
                href={menu.Link}
                className={`${menu.route === route ? 'text-white' : 'text-[#a3a3a3]'} hover:text-[#f5f5f5] text-sm font-normal font-bricolage px-2 cursor-pointer`}
              >
                {menu.navName}
              </a>
            ))}
          </div>
          <div className='flex flex-col lg:hidden'>{ToggleIcon()}</div>
        </div>
      </div>
      <div
        className={
          isToggle
            ? 'fixed z-40 bg-[#0e0e0e] grid grid-rows-9 w-full px-8 right-0 min-h-screen mt-20 rounded-l-xl transition-all duration-800 ease-in-out'
            : 'hidden fixed z-40 bg-white w-full px-3 right-0 min-h-screen transition-all duration-800 ease-in-out'
        }
      >
        {MenuMapping}
      </div>
    </>
  )
}

export default Navbar

'use client'

import React from 'react'
import { CloseOutlined, MenuOutlined, RightOutlined } from '@ant-design/icons'
import { useParams, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { useChainModal } from '@rainbow-me/rainbowkit'
import toast from 'react-hot-toast'
import { useDisconnect } from 'wagmi'

function AuthorityNavbar({ route }) {
  const [isToggle, setIsToggle] = React.useState(false)
  const router = useRouter()
  const { data: session } = useSession()
  const { name } = session?.user ?? {
    name: '0x**************************************',
  }
  const { contract } = useParams()
  const { openChainModal } = useChainModal()
  const { disconnect } = useDisconnect({
    onSuccess: async () => {
      await signOut({ callbackUrl: '/' })
    },
    onError: () => {
      console.log('error', error)
      toast.error('Network Unavailable', { icon: '🚫' })
    },
  })

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
    {
      navName: 'Dashboard',
      Link: `/election/${contract}/authority_dashboard`,
      route: 'dashboard',
    },
    {
      navName: 'Candidate list',
      Link: `/election/${contract}/candidate_list`,
      route: 'candidates_list',
    },
    {
      navName: 'Voters list',
      Link: `/election/${contract}/voters_list`,
      route: 'voters_list',
    },
    {
      navName: `${name.toString().substring(0, 4)}****${name.toString().substring(name.toString().length - 4)}`,
      Link: '',
      route: '',
    },
    { navName: 'Logout', Link: '', route: '' },
  ]

  const MenuMapping = Menu.map((menu, index) => {
    async function openAccount(e) {
      e.preventDefault()
      setIsToggle(!isToggle)
      if (menu.navName === 'Logout') {
        await disconnect()
      } else if (menu.Link === '' && menu.route === '') {
        openChainModal()
      } else {
        return
      }
    }
    return (
      <div key={index} className='flex justify-between items-center'>
        <p
          onClick={openAccount}
          className={`${route === menu.route ? 'text-white' : 'text-[#a3a3a3]'} hover:text- text-lg font-light font-bricolage`}
        >
          {menu.navName}
        </p>
        <RightOutlined
          className={`text-white text-lg font-light font-bricolage`}
        />
      </div>
    )
  })

  return (
    <>
      <div className='bg-[#353935]'>
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
              {Menu.map((menu, index) => {
                async function openAccount(e) {
                  e.preventDefault()
                  if (
                    menu.Link === '' &&
                    menu.route === '' &&
                    menu.navName !== 'Logout'
                  ) {
                    openChainModal()
                  } else if (menu.navName === 'Logout') {
                    await disconnect()
                  } else {
                    router.push(menu.Link)
                  }
                }
                return (
                  <p
                    key={index}
                    onClick={openAccount}
                    className={`${route === menu.route ? 'text-white' : 'text-[#a3a3a3]'} hover:text-[#f5f5f5] text-sm font-normal font-bricolage px-2 cursor-pointer`}
                  >
                    {menu.navName}
                  </p>
                )
              })}
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
      </div>
    </>
  )
}

export default AuthorityNavbar

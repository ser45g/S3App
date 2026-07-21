import { Outlet } from 'react-router-dom'
const BaseLayout = () => {
  return (
    <section className='bg-blue-500 flex flex-col min-h-svh'>
      <section className=' bg-red-600'>
        <p>That's BASE LAYOUT</p>
      </section>
      <Outlet />
    </section>
  )
}

export default BaseLayout
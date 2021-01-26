import Navbar from '../components/Navbar'

export default function MainWrapper({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  )
}

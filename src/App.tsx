import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { About } from './pages/About'
import { Community } from './pages/Community'
import { Contact } from './pages/Contact'
import { Customize } from './pages/Customize'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { ProductDetail } from './pages/ProductDetail'
import { Shop } from './pages/Shop'
import { Upcycling } from './pages/Upcycling'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="tienda" element={<Shop />} />
          <Route path="tienda/:slug" element={<ProductDetail />} />
          <Route path="personalizar" element={<Customize />} />
          <Route path="comunidad" element={<Community />} />
          <Route path="quienes-somos" element={<About />} />
          <Route path="upcycling" element={<Upcycling />} />
          <Route path="contacto" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

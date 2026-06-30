import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout.jsx';

// Route-level code-splitting. Only Home pulls in the Three.js sections, so the
// three/@react-three bundle never reaches service/work/blog/about/contact chunks.
const Home = lazy(() => import('./routes/Home.jsx'));
const ServicesOverview = lazy(() => import('./routes/ServicesOverview.jsx'));
const ServicePage = lazy(() => import('./routes/ServicePage.jsx'));
const WorkIndex = lazy(() => import('./routes/WorkIndex.jsx'));
const CaseStudy = lazy(() => import('./routes/CaseStudy.jsx'));
const BlogIndex = lazy(() => import('./routes/BlogIndex.jsx'));
const BlogPost = lazy(() => import('./routes/BlogPost.jsx'));
const About = lazy(() => import('./routes/About.jsx'));
const Contact = lazy(() => import('./routes/Contact.jsx'));
const Search = lazy(() => import('./routes/Search.jsx'));
const NotFound = lazy(() => import('./routes/NotFound.jsx'));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<ServicesOverview />} />
        <Route path="/services/:slug" element={<ServicePage />} />
        <Route path="/work" element={<WorkIndex />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

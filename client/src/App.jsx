import { motion } from "framer-motion"
import Header from "./components/Header"
import Footer from "./components/Footer"
import MainContent from "./components/MainContent"

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 text-white p-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full mx-auto"
      >
        <Header />
        <MainContent />
      </motion.div>
      <Footer />
    </div>
  )
}

export default App

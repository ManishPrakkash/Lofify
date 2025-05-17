import { motion } from "framer-motion"

function Header() {
    return (
        <header className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div className="text-center md:text-left">
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{
                        duration: 0.5,
                        type: "spring",
                        stiffness: 200,
                    }}
                >
                    <h1 className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 cursor-default">
                        Lofify
                    </h1>
                </motion.div>
                <p className="text-zinc-400">Transform your music into chill lofi vibes</p>
            </div>
        </header>
    )
}

export default Header

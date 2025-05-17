import { motion } from "framer-motion"
import { Instagram } from "lucide-react"

function Footer() {
    return (
        <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="pt-20 mt-auto text-center">
            <p className="text-zinc-500 text-xs mb-2">Lofify © {new Date().getFullYear()} • Chill vibes only</p>
            <p className="text-sm text-zinc-300 flex items-center justify-center gap-2">
                Made with 💜 by
                <a
                    href="https://instagram.com/manishmellow"
                    className="font-medium hover:underline underline-offset-2 text-white flex items-center gap-1"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Instagram className="h-4 w-4" />
                    manishmellow
                </a>
            </p>
        </motion.footer>
    )
}

export default Footer

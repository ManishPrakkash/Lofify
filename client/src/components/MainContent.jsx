import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, Music, Headphones, Download, Loader2, X, Pause, Play } from "lucide-react"
import { Button } from "./ui/button"
import { Progress } from "./ui/progress"
import { Slider } from "./ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Switch } from "./ui/switch"
import toast, { Toaster } from 'react-hot-toast';
import { AudioPlayer } from "./AudioPlayer"
import { Label } from "./ui/label"

// Import song assets
import aaruyireOriginal from "../assets/Aaruyire (PenduJatt.Com.Se).mp3"
import marudaaniOriginal from "../assets/Marudaani (PenduJatt.Com.Se).mp3"
import nenjukulleOriginal from "../assets/Nenjukkule (PenduJatt.Com.Se).mp3"

function MainContent() {
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [downloadUrl, setDownloadUrl] = useState(null)
    const [dragActive, setDragActive] = useState(false)
    const [progress, setProgress] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [duration, setDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const [activeExampleId, setActiveExampleId] = useState(null)
    const [isLofiMode, setIsLofiMode] = useState(true)

    const audioRef = useRef(null)
    const animationRef = useRef(null)
    const inputRef = useRef(null)

    // Example tracks
    const exampleTracks = [
        {
            id: 1,
            title: "Aaruyire",
            artist: "Bombay Jayashri",
            original: aaruyireOriginal,
            // We'll generate the lofi version dynamically
            lofi: `/api/lofi-preview?song=aaruyire`
        },
        {
            id: 2,
            title: "Marudaani",
            artist: "A.R. Rahman",
            original: marudaaniOriginal,
            // We'll generate the lofi version dynamically
            lofi: `/api/lofi-preview?song=marudaani`
        },
        {
            id: 3,
            title: "Nenjukulle",
            artist: "A.R. Rahman",
            original: nenjukulleOriginal,
            // We'll generate the lofi version dynamically
            lofi: `/api/lofi-preview?song=nenjukulle`
        }
    ]

    useEffect(() => {
        // Simulate progress for demo purposes
        if (loading) {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval)
                        return 100
                    }
                    return prev + 5
                })
            }, 300)
            return () => clearInterval(interval)
        }
    }, [loading])

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play()
                animationRef.current = requestAnimationFrame(whilePlaying)
            } else {
                audioRef.current.pause()
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [isPlaying, file])

    const whilePlaying = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime)
            animationRef.current = requestAnimationFrame(whilePlaying)
        }
    }

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00"

        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`
    }

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files)
        }
    }

    const handleChange = (e) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files)
        }
    }

    const handleFiles = (files) => {
        const selectedFile = files[0]

        // Check if file is audio
        if (!selectedFile.type.startsWith('audio/')) {
            toast.error('Please upload an audio file (MP3 or WAV)')
            return
        }

        // Check file size (max 15MB)
        if (selectedFile.size > 15 * 1024 * 1024) {
            toast.error('File size exceeds 15MB limit')
            return
        }

        setFile(selectedFile)
        setDownloadUrl(null)
        setIsPlaying(false)
    }

    const handleButtonClick = () => {
        inputRef.current.click()
    }

    const handleExamplePlayPause = (id, playing) => {
        // Stop any currently playing example
        if (activeExampleId !== id && activeExampleId !== null) {
            setActiveExampleId(null)
        }

        // Toggle the clicked example
        setActiveExampleId(playing ? id : null)
    }

    const handleUpload = async () => {
        if (!file) return
        setCurrentTime(0)
        setIsPlaying(false)
        setLoading(true)
        setProgress(0)
        setDownloadUrl(null)

        const formData = new FormData()
        formData.append("file", file)

        try {
            const response = await fetch("/api/convert", {
                method: "POST",
                body: formData,
            })

            if (response.ok) {
                const blob = await response.blob()
                const url = URL.createObjectURL(blob)
                setDownloadUrl(url)
                toast.success("Song converted successfully!")
            } else {
                toast.error("Failed to process file. Please try again!")
                setProgress(0)
            }

        } catch (error) {
            console.error("Error converting file:", error)
            toast.error("Error converting file. Please try again!")
            setProgress(0)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Tabs defaultValue="convert" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 text-sm sm:text-base">
                <TabsTrigger value="convert">
                    <span className="hidden min-[375px]:inline">Convert Your Music</span>
                    <span className="inline min-[375px]:hidden">Convert</span>
                </TabsTrigger>

                <TabsTrigger value="examples">
                    <span className="hidden min-[375px]:inline">Listen to Examples</span>
                    <span className="inline min-[375px]:hidden">Examples</span>
                </TabsTrigger>
            </TabsList>

            <TabsContent value="convert" className="space-y-6">
                <div className="bg-zinc-800/50 rounded-lg p-6">
                    <input
                        ref={inputRef}
                        type="file"
                        accept="audio/*"
                        onChange={handleChange}
                        className="hidden"
                    />

                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={handleButtonClick}
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                            dragActive
                                ? "border-purple-500 bg-purple-500/10"
                                : "border-zinc-700 hover:border-zinc-600"
                        }`}
                    >
                        {!file && (
                            <div className="flex flex-col items-center justify-center gap-3">
                                <div className="p-3 rounded-full bg-zinc-800">
                                    <Upload className="h-6 w-6 text-zinc-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">
                                        {dragActive ? "Drop your audio file here" : "Drag & drop your audio file here"}
                                    </p>
                                    <p className="text-xs text-zinc-400 mt-1">
                                        Supports MP3, WAV (max 15MB)
                                    </p>
                                </div>
                                <Button
                                    size="sm"
                                    className="mt-2 bg-gradient-to-r from-purple-400 to-pink-600 hover:from-purple-500 hover:to-pink-700 text-white border-none"
                                >
                                    Browse Files
                                </Button>
                            </div>
                        )}

                        {file && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-zinc-800/50 rounded-lg p-4"
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-zinc-700">
                                            <Music className="h-4 w-4 text-zinc-300" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-sm font-medium truncate">{file.name}</p>
                                            <p className="text-xs text-zinc-400">
                                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setFile(null)
                                        }}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="mt-4 space-y-4">
                                    <Button
                                        className="w-full"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleUpload()
                                        }}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Converting...
                                            </>
                                        ) : (
                                            <>
                                                <Headphones className="mr-2 h-4 w-4" />
                                                Convert to Lofi
                                            </>
                                        )}
                                    </Button>

                                    {loading && (
                                        <div className="space-y-1">
                                            <Progress value={progress} />
                                            <p className="text-xs text-right text-zinc-400">
                                                {progress}%
                                            </p>
                                        </div>
                                    )}

                                    {downloadUrl && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="space-y-4"
                                        >
                                            <div className="pt-2">
                                                <audio
                                                    ref={audioRef}
                                                    src={downloadUrl}
                                                    className="hidden"
                                                    onLoadedMetadata={(e) => {
                                                        setDuration(e.currentTarget.duration)
                                                    }}
                                                />

                                                <div className="flex justify-between items-center mb-2">
                                                    <p className="text-sm font-medium">Preview</p>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setIsPlaying(!isPlaying)
                                                        }}
                                                    >
                                                        {isPlaying ? (
                                                            <Pause className="h-4 w-4" />
                                                        ) : (
                                                            <Play className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>

                                                <div className="space-y-1">
                                                    <Slider
                                                        value={[currentTime]}
                                                        max={duration || 100}
                                                        step={0.1}
                                                        onValueChange={(value) => {
                                                            setCurrentTime(value[0])
                                                            if (audioRef.current) {
                                                                audioRef.current.currentTime = value[0]
                                                            }
                                                        }}
                                                    />
                                                    <div className="flex justify-between text-xs text-zinc-400">
                                                        <span>{formatTime(currentTime)}</span>
                                                        <span>{formatTime(duration)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <a
                                                href={downloadUrl}
                                                download={`lofi_${file.name}`}
                                                className="block"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Button className="w-full">
                                                    <Download className="mr-2 h-4 w-4" />
                                                    Download Lofi Version
                                                </Button>
                                            </a>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="examples" className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="lofi-mode"
                            checked={isLofiMode}
                            onCheckedChange={setIsLofiMode}
                        />
                        <Label htmlFor="lofi-mode" className="text-sm">
                            Lofi Mode {isLofiMode ? "On" : "Off"}
                        </Label>
                    </div>
                    <p className="text-xs text-zinc-400">
                        Toggle to compare original and lofi versions
                    </p>
                </div>

                <div className="grid gap-6">
                    {exampleTracks.map((track) => (
                        <motion.div
                            key={track.id}
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut", delay: track.id * 0.08 }}
                        >
                            <AudioPlayer
                                key={track.id}
                                originalSrc={track.original}
                                lofiSrc={track.lofi}
                                title={track.title}
                                artist={track.artist}
                                isPlaying={activeExampleId === track.id}
                                onPlayPause={(playing) => handleExamplePlayPause(track.id, playing)}
                                lofiModeGlobal={isLofiMode}
                            />
                        </motion.div>
                    ))}
                </div>
            </TabsContent>
            <Toaster />
        </Tabs>
    )
}

export default MainContent

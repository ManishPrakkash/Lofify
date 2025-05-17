import { useState, useRef, useEffect } from "react"
import { Play, Pause } from "lucide-react"
import { Button } from "./ui/button"
import { Slider } from "./ui/slider"

export function AudioPlayer({ originalSrc, lofiSrc, title, artist, isPlaying, onPlayPause, lofiModeGlobal }) {
    const [duration, setDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)

    const audioRef = useRef(null)
    const animationRef = useRef(null)

    useEffect(() => {
        const audio = audioRef.current
        
        const setAudioData = () => {
            setDuration(audio.duration)
            setCurrentTime(audio.currentTime)
        }

        const setAudioTime = () => setCurrentTime(audio.currentTime)
        
        // DOM events
        audio.addEventListener('loadeddata', setAudioData)
        audio.addEventListener('timeupdate', setAudioTime)
        
        // Playback state
        if (isPlaying) {
            audio.play()
            animationRef.current = requestAnimationFrame(whilePlaying)
        } else {
            audio.pause()
            cancelAnimationFrame(animationRef.current)
        }

        return () => {
            audio.removeEventListener('loadeddata', setAudioData)
            audio.removeEventListener('timeupdate', setAudioTime)
            cancelAnimationFrame(animationRef.current)
        }
    }, [isPlaying, lofiModeGlobal])

    // When the source changes, reset the audio
    useEffect(() => {
        const audio = audioRef.current
        audio.load()
        setCurrentTime(0)
    }, [lofiModeGlobal])

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

    const onSliderChange = (value) => {
        const newTime = value[0]
        setCurrentTime(newTime)
        audioRef.current.currentTime = newTime
    }

    return (
        <div
            className={`rounded-lg p-4 ${lofiModeGlobal ? "bg-purple-500/10 border-purple-500/30" : "bg-zinc-700/30 border-zinc-700/50"} border transition-colors duration-300`}
        >
            <audio ref={audioRef} src={lofiModeGlobal ? lofiSrc : originalSrc} preload="metadata" className="hidden" />

            <div className="flex flex-col space-y-3">
                <div className="flex justify-between items-center">
                    <div>
                        <h4 className="font-medium text-sm text-zinc-200">{title}</h4>
                        <p className="text-xs text-zinc-400">{artist}</p>
                    </div>

                    <Button
                        size="sm"
                        variant="outline"
                        className={`h-9 w-9 p-0 rounded-full ${lofiModeGlobal ? "bg-purple-500/20 hover:bg-purple-500/30 border-purple-300/30" : "bg-transparent hover:bg-transparent"}`}
                        onClick={() => onPlayPause(!isPlaying)}
                    >
                        {isPlaying ? (
                            <Pause className={`h-4 w-4 text-white fill-white`} />
                        ) : (
                            <Play className={`h-4 w-4 text-white fill-white`} />
                        )}
                    </Button>
                </div>

                <div className="space-y-1">
                    <Slider
                        value={[currentTime]}
                        max={duration || 100}
                        step={0.1}
                        onValueChange={onSliderChange}
                        className={`${lofiModeGlobal ? "bg-purple-500/20" : ""}`}
                    />
                    <div className="flex justify-between text-xs text-zinc-400">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

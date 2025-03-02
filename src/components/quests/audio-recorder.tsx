// src/components/quests/audio-recorder.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useSettingsStore } from "@/store/settingsStore";
import { checkAudioRecordingSupport } from "@/lib/media-utils";

interface AudioRecorderProps {
  onAudioCaptured: (audioBlob: Blob) => void;
}

export function AudioRecorder({ onAudioCaptured }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { animationsEnabled } = useSettingsStore();

  // Check browser compatibility on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const support = checkAudioRecordingSupport();
      setIsSupported(support.isSupported);

      if (!support.isSupported) {
        console.warn("Audio recording not supported in this browser", support);
      }
    }
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  const startRecording = async () => {
    audioChunksRef.current = [];
    setIsPreparing(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Create the media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      // Handle dataavailable event to collect audio chunks
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Handle recording stop
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        onAudioCaptured(audioBlob);

        // Stop all audio tracks
        stream.getAudioTracks().forEach((track) => track.stop());
      };

      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      setIsPreparing(false);

      // Start timer
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setIsPreparing(false);
      toast("Microphone access denied", {
        description: "Please allow microphone access to record audio.",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4">
      {!isSupported && (
        <div className="p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-900 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
              Audio recording not supported
            </p>
            <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
              Your browser doesn't support audio recording. Try using Chrome,
              Safari, or Firefox.
            </p>
          </div>
        </div>
      )}

      {!isRecording && !audioURL && isSupported && (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={startRecording}
          disabled={isPreparing}
        >
          {isPreparing ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Mic className="h-4 w-4 mr-2" />
          )}
          {isPreparing ? "Accessing microphone..." : "Record Voice"}
        </Button>
      )}

      {isRecording && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className={`w-3 h-3 rounded-full bg-red-500 mr-2 ${
                  !animationsEnabled && "animate-pulse"
                }`}
              />
              <span className="text-sm font-medium">
                Recording... {formatTime(recordingTime)}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={stopRecording}
            >
              <Square className="h-4 w-4" />
            </Button>
          </div>
          <Progress
            value={Math.min((recordingTime / 60) * 100, 100)}
            className="h-1"
          />
        </div>
      )}

      {audioURL && !isRecording && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Audio recorded</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                if (audioURL) {
                  URL.revokeObjectURL(audioURL);
                }
                setAudioURL(null);
              }}
            >
              Record again
            </Button>
          </div>
          <audio controls className="w-full">
            <source src={audioURL} type="audio/webm" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
}

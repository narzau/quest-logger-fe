"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

type ViewState = "idle" | "preparing" | "recording" | "processing";

interface AudioRecorderProps {
  onAudioCaptured: (audioBlob: Blob) => Promise<void>;
  onProcessingStateChange?: (isProcessing: boolean) => void;
  onCancel?: () => void;
}

// Constants for audio visualization
const VISUALIZATION_BARS = 15;
const INITIAL_LEVELS = Array(VISUALIZATION_BARS).fill(7);

// Time formatting utility
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

export function AudioRecorder({
  onAudioCaptured,
  onProcessingStateChange,
  onCancel,
}: AudioRecorderProps) {
  const [viewState, setViewState] = useState<ViewState>("idle");
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevels, setAudioLevels] = useState<number[]>(INITIAL_LEVELS);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const isStoppingRef = useRef(false);
  const timerRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);

  const cleanupAudioResources = useCallback(() => {
    mediaRecorderRef.current?.stream
      ?.getTracks()
      .forEach((track) => track.stop());
    audioStreamRef.current?.getTracks().forEach((track) => track.stop());
    audioContextRef.current?.close();

    mediaRecorderRef.current = null;
    audioStreamRef.current = null;
    audioContextRef.current = null;
    analyserRef.current = null;
  }, []);
  // Cleanup effects
  useEffect(() => {
    return () => {
      window.clearInterval(timerRef.current);
      window.cancelAnimationFrame(animationFrameRef.current!);
      cleanupAudioResources();
    };
  }, [cleanupAudioResources]);
  const processAudio = useCallback(
    async (audioBlob: Blob) => {
      setViewState("processing");
      onProcessingStateChange?.(true);

      try {
        await onAudioCaptured(audioBlob);
      } catch (error) {
        console.error("Error processing audio:", error);
        toast.error("Error processing audio", {
          description: "There was a problem processing your voice recording.",
        });
        setViewState("idle");
      } finally {
        onProcessingStateChange?.(false);
      }
    },
    [onAudioCaptured, onProcessingStateChange]
  );

  const processAudioData = useCallback((data: Uint8Array): number[] => {
    const sectionSize = Math.floor(data.length / VISUALIZATION_BARS);
    return Array.from({ length: VISUALIZATION_BARS }, (_, i) => {
      const start = i * sectionSize;
      const end = start + sectionSize;
      const max = Math.max(...Array.from(data.slice(start, end)));
      return 5 + (max / 255) * 35;
    });
  }, []);

  const updateAudioVisualization = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

    const animate = () => {
      analyserRef.current?.getByteFrequencyData(dataArray);
      setAudioLevels(processAudioData(dataArray));
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [processAudioData]);

  const setupAudioContext = useCallback(
    async (stream: MediaStream) => {
      const audioContext = new (window.AudioContext || window.AudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      audioStreamRef.current = stream;

      updateAudioVisualization();
    },
    [updateAudioVisualization]
  );

  const startRecording = useCallback(async () => {
    setViewState("preparing");
    audioChunksRef.current = [];
    isStoppingRef.current = false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = ({ data }) => {
        if (data.size > 0) audioChunksRef.current.push(data);
      };

      mediaRecorder.onstop = () => {
        if (isStoppingRef.current && audioChunksRef.current.length) {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });
          processAudio(audioBlob);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();

      await setupAudioContext(stream);

      setViewState("recording");
      setRecordingTime(0);
      timerRef.current = window.setInterval(
        () => setRecordingTime((t) => t + 1),
        1000
      );
    } catch (error) {
      console.error("Error starting recording:", error);
      setViewState("idle");
      toast.error("Microphone access required", {
        description: "Please enable microphone access to record audio.",
      });
    }
  }, [processAudio, setupAudioContext]);

  const stopRecording = useCallback(() => {
    if (viewState !== "recording") return;

    isStoppingRef.current = true;
    mediaRecorderRef.current?.stop();
    cleanupAudioResources();

    window.clearInterval(timerRef.current);
    if (animationFrameRef.current)
      cancelAnimationFrame(animationFrameRef.current);
  }, [viewState, cleanupAudioResources]);

  const cancelRecording = useCallback(() => {
    isStoppingRef.current = false;
    mediaRecorderRef.current?.stop();
    cleanupAudioResources();

    window.clearInterval(timerRef.current);
    if (animationFrameRef.current)
      cancelAnimationFrame(animationFrameRef.current);

    setViewState("idle");
    setAudioLevels(INITIAL_LEVELS);
    setRecordingTime(0);
    onCancel?.();
  }, [onCancel, cleanupAudioResources]);

  return (
    <div className="flex flex-col items-center justify-center py-2">
      <AnimatePresence mode="wait">
        {viewState === "idle" && (
          <IdleState key="idle" onStartRecording={startRecording} />
        )}

        {viewState === "preparing" && <PreparingState key="preparing" />}

        {viewState === "recording" && (
          <RecordingState
            key="recording"
            audioLevels={audioLevels}
            recordingTime={recordingTime}
            onCancel={cancelRecording}
            onStop={stopRecording}
          />
        )}

        {viewState === "processing" && <ProcessingState key="processing" />}
      </AnimatePresence>
    </div>
  );
}

// Sub-components for each state
const IdleState = ({ onStartRecording }: { onStartRecording: () => void }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.8, opacity: 0 }}
    className="flex flex-col items-center"
  >
    <Button
      type="button"
      className="h-24 w-24 rounded-full bg-primary hover:bg-primary/90"
      onClick={onStartRecording}
    >
      <Mic className="h-20 w-10 text-red-400" />
    </Button>
    <p className="text-sm text-muted-foreground mt-2">Tap to speak</p>
  </motion.div>
);

const PreparingState = () => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.8, opacity: 0 }}
    className="flex flex-col items-center"
  >
    <Button className="h-24 w-24 rounded-full bg-muted" disabled>
      <Loader2 className="h-8 w-8 animate-spin text-primary-foreground" />
    </Button>
    <p className="text-sm text-muted-foreground mt-2">Preparing...</p>
  </motion.div>
);

const RecordingState = ({
  audioLevels,
  recordingTime,
  onCancel,
  onStop,
}: {
  audioLevels: number[];
  recordingTime: number;
  onCancel: () => void;
  onStop: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center w-full"
  >
    <div className="flex items-center justify-center mb-4 relative">
      <div className="flex items-end h-20 space-x-1 px-2">
        {audioLevels.map((height, i) => (
          <motion.div
            key={i}
            className="w-2 bg-primary rounded-full"
            style={{ height: `${height}px` }}
            transition={{ duration: 0.05 }}
          />
        ))}
      </div>
      <motion.div
        className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2"
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(239, 68, 68, 0.2)",
            "0 0 0 8px rgba(239, 68, 68, 0)",
          ],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="h-4 w-4 rounded-full bg-red-500" />
      </motion.div>
    </div>

    <div className="text-base font-medium">{formatTime(recordingTime)}</div>

    <div className="flex space-x-4 mt-4">
      <Button
        variant="outline"
        size="icon"
        onClick={onCancel}
        className="h-10 w-10 rounded-full border-gray-300"
      >
        <X className="h-4 w-4 text-gray-500" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onStop}
        className="h-10 w-10 rounded-full border-red-500 hover:bg-red-500/10"
      >
        <Square className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  </motion.div>
);

const ProcessingState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center w-full"
  >
    <div className="flex flex-col items-center mb-4">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Mic className="h-6 w-6 text-primary" />
        </div>
      </div>
      <p className="text-base font-medium mt-4">Processing...</p>
      <p className="text-sm text-muted-foreground">Creating your quest</p>
    </div>

    <div className="w-full max-w-xs">
      <motion.div
        className="w-full h-1 bg-primary/20 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="h-full bg-primary"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 3.5, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  </motion.div>
);

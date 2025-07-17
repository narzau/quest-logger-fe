"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, X, Play, Pause, Check, AlertTriangle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

type ViewState = "idle" | "preparing" | "recording" | "paused" | "recorded" | "error";

interface AudioRecorderProps {
  // Changed from requiring a promise to a simple callback 
  onAudioReady?: (audioBlob: Blob) => void;
  // Added separate callback for submissions
  onSubmit?: (audioBlob: Blob) => void | Promise<void>;
  // Processing state is now controlled by parent
  isProcessing?: boolean;
  // Success and error states now controlled by parent
  isSuccess?: boolean;
  isError?: boolean;
  // Cancel callback
  onCancel?: () => void;
  // Added props for customization
  submitButtonLabel?: string;
  autoSubmit?: boolean;
  showControls?: boolean;
  autoRecord?: boolean;
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
  onAudioReady,
  onSubmit,
  isProcessing = false,
  isSuccess = false,
  isError = false,
  onCancel,
  submitButtonLabel = "Submit",
  autoSubmit = false,
  showControls = true,
  autoRecord = false,
}: AudioRecorderProps) {
  console.log('🎤 AudioRecorder rendered with autoRecord:', autoRecord);
  
  const [viewState, setViewState] = useState<ViewState>("idle");
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevels, setAudioLevels] = useState<number[]>(INITIAL_LEVELS);
  const [currentAudioBlob, setCurrentAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const isStoppingRef = useRef(false);
  const timerRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Notify parent when we have a valid audio blob
  useEffect(() => {
    if (currentAudioBlob && onAudioReady && viewState === "paused") {
      onAudioReady(currentAudioBlob);
      
      // If autoSubmit is true, automatically call onSubmit if available
      if (autoSubmit && onSubmit) {
        onSubmit(currentAudioBlob);
      }
    }
  }, [currentAudioBlob, viewState, onAudioReady, onSubmit, autoSubmit]);

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
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current = null;
      }
    };
  }, [cleanupAudioResources]);
  
  // Stop playback of previously recorded audio
  const stopPlayback = useCallback(() => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
      setIsPlaying(false);
    }
  }, []);

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

  const cleanupRecordingResources = useCallback(() => {
    // Stop any ongoing recording
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    // Clean up audio resources
    cleanupAudioResources();

    // Stop timer if it's running
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = 0;
    }
    
    // Cancel animation frame if it's running
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = 0;
    }
  }, [cleanupAudioResources]);

  const resetRecorder = useCallback((targetState: ViewState = "idle") => {
    // Clean up resources first
    cleanupRecordingResources();
    
    // Reset state variables
    stopPlayback();
    setCurrentAudioBlob(null);
    
    // Reset audio levels to a normalized state
    const normalizedLevels = INITIAL_LEVELS.map(h => Math.max(5, Math.min(h, 15)));
    setAudioLevels(normalizedLevels);
    
    // Set the view state and reset the timer
    setViewState(targetState);
    setRecordingTime(0);
    audioChunksRef.current = [];
  }, [cleanupRecordingResources, stopPlayback]);

  const startRecording = useCallback(async () => {
    // Reset to a clean state before starting
    resetRecorder("preparing");
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = ({ data }) => {
        if (data.size > 0) audioChunksRef.current.push(data);
      };

      mediaRecorder.onstop = () => {
        if (audioChunksRef.current.length) {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });
          setCurrentAudioBlob(audioBlob);
          
          if (isStoppingRef.current) {
            // Only go to the paused state if we're intentionally stopping
            setViewState("paused");
          }
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
      resetRecorder("error");
    }
  }, [resetRecorder, setupAudioContext]);

  // Auto-start recording when autoRecord is true
  useEffect(() => {
    if (autoRecord && viewState === "idle") {
      // Add a small delay to ensure component is fully mounted
      const timer = setTimeout(() => {
        startRecording().catch((error) => {
          console.error('Auto-recording failed:', error);
        });
      }, 1000); // Increased delay to ensure everything is ready
      
      return () => clearTimeout(timer);
    }
  }, [autoRecord, viewState, startRecording]);

  const pauseRecording = useCallback(() => {
    if (viewState !== "recording") return;

    isStoppingRef.current = true;
    
    // Stop the media recorder but keep the audio chunks
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    
    // Clean up resources
    cleanupAudioResources();

    // Stop the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = 0;
    }
    
    // Stop animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = 0;
    }
  }, [viewState, cleanupAudioResources]);

  const resumeRecording = useCallback(async () => {
    if (viewState !== "paused") return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = ({ data }) => {
        if (data.size > 0) audioChunksRef.current.push(data);
      };

      mediaRecorder.onstop = () => {
        if (audioChunksRef.current.length) {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });
          setCurrentAudioBlob(audioBlob);
          
          if (isStoppingRef.current) {
            setViewState("paused");
          }
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();

      await setupAudioContext(stream);

      setViewState("recording");
      // Resume the timer from where it left off
      timerRef.current = window.setInterval(
        () => setRecordingTime((t) => t + 1),
        1000
      );
    } catch (error) {
      console.error("Error resuming recording:", error);
      setViewState("error");
    }
  }, [viewState, setupAudioContext]);

  const playRecording = useCallback(() => {
    if (!currentAudioBlob) return;
    
    // Create a new audio element for playback
    const audioUrl = URL.createObjectURL(currentAudioBlob);
    const audioElement = new Audio(audioUrl);
    
    audioElement.onended = () => {
      setIsPlaying(false);
      URL.revokeObjectURL(audioUrl);
    };
    
    audioElement.onpause = () => {
      setIsPlaying(false);
    };
    
    audioElement.onplay = () => {
      setIsPlaying(true);
    };
    
    audioElementRef.current = audioElement;
    audioElement.play();
  }, [currentAudioBlob]);

  const cancelRecording = useCallback(() => {
    resetRecorder("idle");
    
    // Close the dialog if onCancel is provided
    onCancel?.();
  }, [resetRecorder, onCancel]);

  const discardRecording = useCallback(() => {
    resetRecorder("idle");
  }, [resetRecorder]);

  const submitRecording = useCallback(() => {
    if (!currentAudioBlob || !onSubmit) return;
    
    // Call parent's onSubmit with the current audio blob
    onSubmit(currentAudioBlob);
  }, [currentAudioBlob, onSubmit]);

  const handleErrorRetry = useCallback(() => {
    if (recordingTime > 0) {
      // Had a recording before, go back to paused state
      setViewState("paused");
    } else {
      // Start fresh
      startRecording();
    }
  }, [recordingTime, startRecording]);

  // Update view state based on external props
  useEffect(() => {
    if (isProcessing) {
      setViewState("recorded"); // Just keep in recorded state while parent shows processing UI
    } else if (isSuccess) {
      // Can transition back to idle if needed
      resetRecorder("idle");
    } else if (isError) {
      setViewState("error");
    }
  }, [isProcessing, isSuccess,resetRecorder, isError]);


  return (
    <div className="flex flex-col items-center justify-center py-2">
      <RecordingUI
        viewState={viewState}
        recordingTime={recordingTime}
        audioLevels={audioLevels}
        isPlaying={isPlaying}
        isProcessing={isProcessing}
        isSuccess={isSuccess}
        isError={isError}
        submitButtonLabel={submitButtonLabel}
        showControls={showControls}
        onStartRecording={startRecording}
        onPause={pauseRecording}
        onPlay={playRecording}
        onStopPlayback={stopPlayback}
        onResume={resumeRecording}
        onDiscard={discardRecording}
        onCancel={cancelRecording}
        onSubmit={submitRecording}
        onErrorRetry={handleErrorRetry}
      />
    </div>
  );
}

// Unified Recording UI with consistent controls across all states
const RecordingUI = ({
  viewState,
  recordingTime,
  audioLevels,
  isPlaying,
  isProcessing,
  isSuccess,
  isError,
  submitButtonLabel,
  showControls,
  onStartRecording,
  onPause,
  onPlay,
  onStopPlayback,
  onResume,
  onDiscard,
  onCancel,
  onSubmit,
  onErrorRetry
}: {
  viewState: ViewState;
  recordingTime: number;
  audioLevels: number[];
  isPlaying: boolean;
  isProcessing?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  submitButtonLabel?: string;
  showControls?: boolean;
  onStartRecording: () => void;
  onPause: () => void;
  onPlay: () => void;
  onStopPlayback: () => void;
  onResume: () => void;
  onDiscard: () => void;
  onCancel: () => void;
  onSubmit: () => void;
  onErrorRetry: () => void;
}) => {
  // Helper functions to determine button states
  const isIdle = viewState === "idle";
  const isRecording = viewState === "recording";
  const isPaused = viewState === "paused";
  const isPreparing = viewState === "preparing";
  
  // Has recorded content that could be submitted or discarded
  const hasContent = isPaused;
  
  // Use a local variable for display purposes
  const showSuccessState = isSuccess === true;
  const showErrorState = isError === true || viewState === "error";
  const showProcessingState = isProcessing === true;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center w-full"
    >
      {/* Central display area - consistent layout across all states */}
      <div className="mb-6 h-36 flex items-center justify-center">
        {isIdle ? (
          // Idle state - visualization placeholder
          <div className="flex flex-col items-center">
            {isPreparing ? (
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center mb-3 relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="h-12 w-12 rounded-full border-2 border-primary/20 border-t-primary"
                  />
                </div>
                <div className="text-base font-medium h-6 flex items-center justify-center">
                  {formatTime(0)}
                </div>
                <p className="text-sm text-muted-foreground h-5">Preparing...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center mb-3 relative">
                  <div className="flex items-end h-20 space-x-1 px-2">
                    {INITIAL_LEVELS.map((height, i) => (
                      <div
                        key={i}
                        className="w-2 bg-muted-foreground opacity-60 rounded-full"
                        style={{ 
                          height: Math.max(5, Math.min(height, 15)) + 'px'
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-base font-medium h-6 flex items-center justify-center">
                  {formatTime(0)}
                </div>
                <p className="text-sm text-muted-foreground h-5">Press record to start</p>
              </div>
            )}
          </div>
        ) : isRecording ? (
          // Recording state - active waveform visualization
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center mb-3 relative">
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
            <div className="text-base font-medium h-6 flex items-center justify-center">
              {formatTime(recordingTime)}
            </div>
            <p className="text-sm text-muted-foreground h-5">Recording...</p>
          </div>
        ) : isPaused ? (
          // Paused state - flattened, greyed-out visualization
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center mb-3 relative">
              <div className="flex items-end h-20 space-x-1 px-2">
                {audioLevels.map((height, i) => (
                  <div
                    key={i}
                    className="w-2 bg-muted-foreground opacity-60 rounded-full"
                    style={{ 
                      height: Math.max(5, Math.min(height, 15)) + 'px'
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="text-base font-medium h-6 flex items-center justify-center">
              {formatTime(recordingTime)}
            </div>
            <p className="text-sm text-muted-foreground h-5">Recording paused</p>
          </div>
        ) : showProcessingState ? (
          // Processing state - spinner and progress
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center mb-3 relative">
              <div className="h-20 w-full flex items-center justify-center">
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary"
                />
                <motion.div 
                  initial={{ opacity: 0.6, scale: 0.9 }}
                  animate={{ 
                    opacity: [0.6, 1, 0.6],
                    scale: [0.9, 1, 0.9]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Mic className="h-8 w-8 text-primary" />
                </motion.div>
              </div>
            </div>
            <div className="text-base font-medium h-6 flex items-center justify-center">
              {formatTime(recordingTime)}
            </div>
            <motion.p 
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-sm text-muted-foreground h-5"
            >
              Processing your recording...
            </motion.p>
          </div>
        ) : showSuccessState ? (
          /* Success state animation */
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center mb-3 relative">
              <div className="h-20 w-full flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: [0.8, 1.1, 1],
                    opacity: 1
                  }}
                  transition={{ 
                    duration: 0.5,
                    times: [0, 0.7, 1],
                    ease: "easeOut"
                  }}
                  className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: 1,
                      opacity: 1,
                    }}
                    transition={{ 
                      delay: 0.3,
                      duration: 0.3,
                      ease: "backOut"
                    }}
                  >
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </motion.div>
                </motion.div>
              </div>
            </div>
            <div className="text-base font-medium h-6 flex items-center justify-center">
              {formatTime(recordingTime)}
            </div>
            <motion.p 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-sm text-green-600 font-medium h-5"
            >
              Recording saved successfully!
            </motion.p>
          </div>
        ) : showErrorState ? (
          /* Error state animation */
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center mb-3 relative">
              <div className="h-20 w-full flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: [0.8, 1.1, 1],
                    x: [0, -10, 10, -10, 10, -5, 5, 0],
                    opacity: 1
                  }}
                  transition={{ 
                    scale: { duration: 0.4, times: [0, 0.7, 1], ease: "easeOut" },
                    x: { duration: 0.6, delay: 0.3, ease: "easeOut" },
                    opacity: { duration: 0.3 }
                  }}
                  className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: 1,
                      opacity: 1,
                    }}
                    transition={{ 
                      delay: 0.3,
                      duration: 0.3,
                      ease: "backOut"
                    }}
                  >
                    <AlertTriangle className="h-10 w-10 text-red-600" />
                  </motion.div>
                </motion.div>
              </div>
            </div>
            <div className="text-base font-medium h-6 flex items-center justify-center">
              {formatTime(recordingTime)}
            </div>
            <motion.p 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-sm text-red-600 font-medium h-5"
            >
              {recordingTime > 0 ? "Error processing recording!" : "Microphone access error!"}
            </motion.p>
          </div>
        ) : null}
      </div>

      {/* Control buttons - only show if showControls is true and not in processing/success/error states */}
      {showControls && !showProcessingState && !showSuccessState && !showErrorState ? (
        <div className="w-full">
          {/* Playback/recording controls */}
          <div className="flex justify-center items-center space-x-4 mb-4">
            {/* Discard button */}
            <Button
              variant="outline"
              size="icon"
              onClick={isRecording ? onCancel : onDiscard} // Use onCancel during recording, otherwise onDiscard
              disabled={isIdle && !isRecording || isPreparing}
              className="h-10 w-10 rounded-full"
              title={isRecording ? "Cancel recording" : "Discard recording"}
            >
              <X className="h-4 w-4" />
            </Button>
            
            {/* Record/Pause button - MAIN BUTTON - bigger and different color */}
            <Button
              variant={isRecording ? "destructive" : "default"}
              size="icon"
              onClick={isRecording ? onPause : isPaused ? onResume : onStartRecording}
              disabled={isPreparing}
              className="h-14 w-14 rounded-full shadow-md"
              title={isRecording ? "Pause recording" : "Start recording"}
            >
              {isRecording ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </Button>
            
            {/* Play/Stop button */}
            <Button
              variant="outline"
              size="icon"
              onClick={isPlaying ? onStopPlayback : onPlay}
              disabled={isIdle || isRecording || isPreparing || !hasContent}
              className="h-10 w-10 rounded-full"
              title={isPlaying ? "Stop playback" : "Play recording"}
            >
              {isPlaying ? (
                <Square className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {/* Submit button - only enabled when there's content to submit */}
          <Button
            onClick={onSubmit}
            disabled={!hasContent}
            className="w-full flex items-center justify-center gap-2"
          >
            <Check className="h-4 w-4" />
            {submitButtonLabel}
          </Button>
        </div>
      ) : showErrorState ? (
        // For error state, show a retry button
        <div className="w-full mt-4">
          <Button 
            onClick={onErrorRetry}
            variant="outline"
            className="w-full"
          >
            {recordingTime > 0 ? "Try Again" : "Retry"}
          </Button>
        </div>
      ) : (
        // Show a message when processing or success state
        <div className="mt-4 w-full text-center">
          {showProcessingState && (
            <p className="text-muted-foreground text-sm">Please wait while your recording is being processed...</p>
          )}
        </div>
      )}
    </motion.div>
  );
};
